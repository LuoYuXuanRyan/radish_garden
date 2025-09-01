---
title: 'CAMEL Multi-Agent Summer Camp Task5/6'
publishDate: '2025-09-01'
description: 'CAMEL多智能体夏令营任务5/6笔记'
introText: '本文记录了CAMEL多智能体夏令营任务5/6的关于 Agent 的一些学习笔记。在[这篇文章](https://luoyuxuanryan.pages.dev/posts/understanding-RAG.md)中主要讲了什么是RAG，以及RAG的几种范式，本文主要聚焦于如何使用CAMEL搭建一个RAG。'
author: 'Ryan'
tags: ['MultiAgent', 'CAMEL']
slug: 'camel-multi-agent-summer-camp-task56'
---

# CAMEL Multi-Agent Summer Camp 5/6

在[这篇文章](../posts/understanding-RAG.md)中主要讲了什么是RAG，以及RAG的几种范式，本文主要聚焦于如何使用CAMEL搭建一个RAG。

## 搭建Basic RAG
VectorRetriever（向量检索）：
- 分块：对于大型文档、网页或非结构化数据，需按照预设规则（如固定字符长度、语义段落边界、章节划分等）分解为更小的信息单元（即“分块”），避免因数据体量过大导致后续处理效率低或语义割裂。
- 嵌入：针对每个分块，使用预训练的嵌入模型（如BERT、Sentence-BERT、OpenAI Embeddings等）将文本形式的分块转换为高维向量（通常为数百至数千维），向量的每个维度对应文本的特定语义特征（如“情感倾向”“主题关联度”“实体关系”等），实现“语义数值化”。
- 存储：将生成的所有高维向量统一存储到专门的向量数据库中（如Milvus、FAISS、Chroma等），这类数据库支持高效的向量索引构建（如IVF、HNSW等索引算法），为后续快速检索奠定基础。
- 检索：当用户输入查询（问题或关键词）时，先通过与分块阶段相同的嵌入模型，将查询文本转换为与分块向量维度一致的“查询向量”；再在向量数据库中计算查询向量与所有存储向量的相似度（常用余弦相似度、欧氏距离、曼哈顿距离等指标，其中余弦相似度因更关注方向一致性，在语义匹配场景中应用最广）；最后根据相似度得分排序，返回得分最高的Top-N个向量对应的原始信息分块，完成检索。
- 优化（可选）：为提升检索精度与效率，可加入后续优化步骤，如对分块向量进行归一化处理（减少维度量级影响）、动态调整分块大小（根据文本类型适配，如技术文档分块可更长、社交媒体文本分块可更短）、结合过滤条件（如时间范围、文档类型筛选）等。

BM25Retriever（BM25检索）：
- 分块：与向量检索类似，需将大型文档或数据按规则（如句子、段落、固定字符长度）分解为独立的“文档单元”（BM25中通常称每个分块为“文档”，此处“文档”为检索最小单元，非原始完整文档），确保每个单元语义相对完整且便于词频统计。
- 预处理：对每个文档单元和后续查询文本进行统一预处理，消除噪声干扰，常见操作包括：分词（将文本拆分为独立词语，如英文按空格分词、中文用jieba等工具分词）、停用词去除（删除“的”“the”“and”等无实际语义的高频词）、词干提取/词形还原（如将“running”“ran”统一为“run”，减少词形差异导致的匹配偏差）。
- 索引构建：基于预处理后的文档单元，构建“倒排索引”——以“词语”为key，以“包含该词语的文档单元ID+该词语在文档中的出现频次（TF）+文档长度”为value的索引结构，实现从“词语”到“文档”的快速映射，避免检索时遍历所有文档。
- 检索：
  1. 查询预处理：对用户输入的查询文本执行与文档单元相同的预处理（分词、去停用词、词形处理），得到查询词集合。
  2. 相关性计算：基于BM25算法公式，计算每个文档单元与查询的相关性得分。公式核心逻辑为：综合考虑“查询词在文档中的词频（TF，词频越高得分越高，但会受文档长度惩罚，避免长文档因词多误判）”“查询词在所有文档中的逆文档频率（IDF，词越稀有，对检索区分度越高，得分权重越大）”“文档长度与平均文档长度的比值（修正文档长度对词频的影响）”三个关键因素。
  3. 结果返回：根据BM25相关性得分对所有文档单元降序排序，返回得分最高的Top-N个文档单元，完成检索。
- 参数调优（可选）：通过调整BM25算法中的超参数（如k1（控制TF饱和程度，通常取1.2-2.0）、b（控制文档长度惩罚强度，通常取0.75）），适配不同场景（如短文本检索、长文档检索），进一步优化得分准确性。

运行以下代码需要安装额外解析PDF的库：
```bash
uv pip install "unstructured[pdf]"
```
Basic RAG代码：
```python
import os
from camel.agents import ChatAgent
from camel.retrievers import AutoRetriever
from camel.types import StorageType
from camel.types import ModelPlatformType
from camel.models import ModelFactory
from camel.embeddings import SentenceTransformerEncoder

from dotenv import load_dotenv

load_dotenv()

print("Env loaded!")

MODELSCOPE_API_KEY = os.getenv("MODELSCOPE_API_KEY")

model = ModelFactory.create(
    model_platform=ModelPlatformType.OPENAI_COMPATIBLE_MODEL,
    model_type="Qwen/Qwen3-235B-A22B-Instruct-2507",
    url='https://api-inference.modelscope.cn/v1/',
    api_key=MODELSCOPE_API_KEY
)

print("Loading embedding model...")
embedding_model = SentenceTransformerEncoder(
    model_name='sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
print("Embedding model loaded!")

def single_agent(query: str) -> str:
    assistant_sys_msg = """你是一个帮助回答问题的助手，
        我会给你原始查询和检索到的上下文，
        根据检索到的上下文回答原始查询，
        如果你无法回答问题就说我不知道。"""

    print("Loading auto retriever...")
    auto_retriever = AutoRetriever(
        vector_storage_local_path="local_data1/",
        storage_type=StorageType.QDRANT,
        embedding_model=embedding_model)
    print("Auto retriever loaded.")

    print("Running vector retriever...")
    retrieved_info = auto_retriever.run_vector_retriever(
        query=query,
        contents=[
            "local_data/camel_paper.pdf",  # 示例本地路径
            "https://github.com/camel-ai/camel/wiki/Contributing-Guidlines",  # 示例url
        ],
        top_k=5,
        return_detailed_info=False,
        similarity_threshold=0.5,
        max_characters=1024
    )
    print("Vector retriever finished.")

    user_msg = "```context\n" + str(retrieved_info) + "```\n"
    user_msg += "\n基于以上信息，回答以下问题：\n" + query
    print(user_msg)
    agent = ChatAgent(assistant_sys_msg, model=model)

    # 获取响应
    assistant_response = agent.step(user_msg)
    return assistant_response.msg.content


print(single_agent("如果我对贡献CAMEL项目感兴趣，我应该怎么做？"))
```

## Rewriting
在实际的应用中，很多时候我们可能会发现，用户的提问是不一定准确的，比如存在错别字，语义顺序颠倒等情况，甚至有时候用户对于自己 Quer 究竟要如何表达也是模糊不清的，而阅读并实践了上一章节的读者可能会有一个直观的感受，就是Query不仅会作用在检索的部分，还会作用在最后生成回复的部分，简而言之，Query的质量可能会极大程度地影响整个RAG系统的表现和性能。
因此在这里，我们尝试加入一个对于初始Query的改写或者澄清模块，又称为`Rewriting`，来尽可能提高Query的质量或增强之后RAG环节的质量。

## Reranking
为了增加检索结果的多样性，我们使用`Reranking`模块，帮助生成更高质量的答案。
`Rerank`模块对初步检索结果重新排序可以简单概括为以下几步：
1. 初步检索：获取（多路召回）初始文档片段
2. 特征计算：评估每个文档的相关性
3. 重新排序：根据特征得分排序
4. 选择最佳结果：根据重排结果倒序排列，取前TOP-K个作为最终的最相关结果交给LLM生成回复

倒数排序融合(Reciprocal Rank Fusion, RRF)算法是一种将具有不同相关性指标的多个结果集组合成单个结果集的方法，不同的相关性指标也不必相互关联即可获得高质量的结果。该方法的优势在于不利用相关分数，而仅靠排名计算。常使用该算法作为`reranker`。

$RRF\text{-}Score(x) = \sum_{i=1}^{t} \frac{1}{k + r_i(x)}$

## 命中率(hit rate) 和 平均倒数排名(MRR)。
**命中率(Hit Rate)：**
Hit rate计算在前k个检索文档中找到正确答案的查询比例。简单来说，它是关于我们的系统在前几次猜测中正确的频率。

**平均倒数排名(MRR)：**
对于每个查询，MRR通过查看排名最高的相关文档的排名来评估系统的准确性。具体来说，它是所有查询中这些秩的倒数的平均值。因此，如果第一个相关文档是顶部结果，则倒数排名为1; 如果是第二个，倒数是1/2，以此类推。

## RAG 评估
评估RAG应用需要综合考虑：
- 检索性能：检索的准确率和召回率

检索模块决定了从知识库中找到的文档质量，是RAG应用的基础。主要评估指标包括：
- 准确率（Precision）：检索结果中相关文档的比例。
- 召回率（Recall）：所有相关文档中被检索出的比例。
- F1值：准确率和召回率的调和平均值。
- 生成质量：回答的准确性、流畅度和相关性
- 准确性：回答是否正确。
- 流畅性：语言是否自然。
- 相关性：回答是否与问题紧密相关。
- 用户体验：响应速度、交互友好性

用户体验评估主要关注应用的交互友好性，包括：
- 响应速度：回答的生成时间。
- 交互性：系统界面和交互设计是否直观。
- 稳定性：系统是否可靠，无明显错误。