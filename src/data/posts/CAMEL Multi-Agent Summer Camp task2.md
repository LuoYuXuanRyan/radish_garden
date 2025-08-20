---
title: 'CAMEL Multi-Agent Summer Camp Task2'
publishDate: '2025-08-20'
description: 'CAMEL多智能体夏令营任务2笔记'
introText: '本文记录了CAMEL多智能体夏令营任务2的关于 Agent 的一些学习笔记。本文根据官方文档内容整理。In a LLM-powered autonomous agent system, LLM functions as the agent’s brain, complemented by several key components: Planning, Memeory, Tool use.'
author: 'Ryan'
tags: ['Agent', 'CAMEL']
slug: 'camel-multi-agent-summer-camp-task2'
---

# CAMEL Multi-Agent Summer Camp Task2

## Agent 是什么？
(Lilian Weng 的博客)[https://lilianweng.github.io/posts/2023-06-23-agent/]中提到：
> In a LLM-powered autonomous agent system, LLM functions as the agent’s brain, complemented by several key components:
> - **Planning**
    - Subgoal and decomposition: The agent breaks down large tasks into smaller, manageable subgoals, enabling efficient handling of complex tasks.
    - Reflection and refinement: The agent can do self-criticism and self-reflection over past actions, learn from mistakes and refine them for future steps, thereby improving the quality of final results.
> -  **Memory**
    - Short-term memory: I would consider all the in-context learning (See [Prompt Engineering](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)) as utilizing short-term memory of the model to learn.
    - Long-term memory: This provides the agent with the capability to retain and recall (infinite) information over extended periods, often by leveraging an external vector store and fast retrieval.
> - **Tool use**
    - The agent learns to call external APIs for extra information that is missing from the model weights (often hard to change after pre-training), including current information, code execution capability, access to proprietary information sources and more.

在LLM驱动的自主 Agent 系统中，LLM 作为代理的大脑，辅以几个关键组件：
- 规划
	- 子目标和分解：Agent 将大型任务分解为更小、可管理的子目标，从而能够高效地处理复杂的任务。
	- 反思和完善：Agent 可以对过去的行为进行自我批评和自我反思，从错误中吸取教训，并为未来的步骤进行完善，从而提高最终结果的质量。
- 记忆
	- 短期记忆：所有上下文学习(ICL)都是利用模型的短期记忆来学习。
	- 长期记忆：这为 Agent 提供了在很长一段时间内保留和调用（无限）信息的能力，通常通过利用外部向量存储和快速检索。
- 工具使用
	- Agent 学习调用外部API，以获取模型权重中缺失的额外信息（在预训练后通常难以更改），包括当前信息、代码执行能力、访问专有信息源等。

LLM 驱动的 Agent 系统结构
![[agent-overview.png]]

## CAMEL Agent 开发
**以下内容基于[CAMEL 官方文档](https://datawhalechina.github.io/handy-multi-agent/#/chapter2/2.3.models)整理**
### Model
Model 是 Agent 的大脑，负责处理所有输入和输出数据。通过有效调用不同的模型，Agent 可以根据任务需求执行文本分析、图像识别和复杂推理等操作。
一个常见的调用 LLM 的方法是前往官网或第三方 API 平台注册账号并购买额度，使用 OpenAI 兼容的 API 访问并调用模型。
在 CAMEL 中使用方法如下：
```python
from camel.models import ModelFactory
from camel.types import ModelPlatformType
import os

model = ModelFactory.create(
    model_platform=ModelPlatformType.OPENAI_COMPATIBLE_MODEL,
    model_type="model_name",
    api_key=os.environ.get("OPENAI_COMPATIBILIY_API_KEY", ""),
    url=os.environ.get("OPENAI_COMPATIBILIY_API_BASE_URL", "openai_compatibility_api_base_url"),
    model_config_dict={"temperature": 0.7, "max_tokens": 4096},
)
```

如果你想使用本地的模型，可以考虑使用 Ollama，CAMEL 也提供直接的 API 调用：
```python
model = ModelFactory.create(
    model_platform=ModelPlatformType.OLLAMA,
    model_type="qwen2.5",
    model_config_dict={"temperature": 0.7, "max_tokens": 4096},
)
```

### Messages
简单来说，Agent 的 Message 就是指系统中“智能体”或“代理者”之间互相传递的指令或数据包。就好比你给朋友发一条微信消息请他帮忙带杯咖啡，在智能系统中，`Agent`则是那些负责完成任务的角色，而`Message`则是他们沟通和协作的工具。当一个 Agent 收到 Message 后，会根据内容做出决策、执行任务或回复信息。
在 CAMEL 系统中，`BaseMessage` 是所有消息对象的基础类，它为对话中的每一条信息提供了统一的结构和标准化的处理方式。无论是用户输入的一段文本，还是包含图片、视频等多模态信息的数据包，都可以通过 `BaseMessage` 来统一表示和管理。

> 为什么需要统一的消息结构？

在一个对话系统中，消息可能来自多方（如用户、系统、不同类型的 Agent），且信息内容不局限于纯文本，还可能包括图像、视频甚至是自定义的元数据（metadata）。如果没有一个统一的基础类来约束这些消息的格式，开发者就会面临如下问题：
- **类型繁杂且难以维护**：不同消息类型需要各自的代码逻辑和数据结构，导致系统复杂度提高。
- **难以扩展和对接**：当需要增加新类型的消息（如引入新媒体格式或上下文信息）时，很可能需要大幅度修改原有代码。    
- **通用处理困难**：缺乏统一结构会让调试、日志记录和分析对话信息变得更加麻烦。
通过使用 `BaseMessage`，可以：
- 将消息的创建、变形（如格式转换）和传递标准化。
- 简化对消息类型的扩展，提高代码的可维护性和可读性。
- 为后续的功能模块（如消息过滤、路由、多轮对话管理）提供一个统一的数据基础。

创建一个`BaseMessage`实例：
```python
from camel.messages import BaseMessage
from camel.types import RoleTypemessage
message = BaseMessage(
    role_name="example_user",  # 消息来源名称，如"User"、"Assistant"或"System"，帮助追踪消息来源
    role_type=RoleType.USER,  # RoleType.USER：表示该消息来自用户，RoleType.ASSISTANT：表示该消息来自智能助手
    content="Hello, CAMEL!",  # 消息的核心载体，一般是文本，也可能是解析指令、问题描述或描述性文字。
    meta_dict={}  # 添加必需的meta dict参数，即使为空也要提供，否则会报 TypeError
))
```

添加多模态内容：
```python
from PIL import Image
from io import BytesIO
import requests
from camel.types import RoleType
from camel.messages import BaseMessage

# 下载一张图片并创建一个 PIL Image 对象
url = "https://raw.githubusercontent.com/camel-ai/camel/master/misc/logo_light.png"
response = requests.get(url)
img = Image.open(BytesIO(response.content))

# 创建包含图片的用户消息
image_message = BaseMessage(
    role_name="User_with_image",
    role_type=RoleType.USER,
    content="Here is an image",
    meta_dict={},
    image_list=[img]  # 将图片列表作为参数传入
)
```

快速生成不同类型的消息：
```python
from camel.messages import BaseMessage

# 创建用户消息
user_msg = BaseMessage.make_user_message(
    role_name="User_1",
    content="Hi, what can you do?"
)

# 创建助手消息
assistant_msg = BaseMessage.make_assistant_message(
    role_name="Assistant_1",
    content="I can help you with various tasks."
)
```

适配 OpenAI 后端的消息格式
```python
from camel.types import OpenAIBackendRole

# 将用户消息转化为OpenAI后端兼容的用户消息
openai_user_msg = user_msg.to_openai_message(role_at_backend=OpenAIBackendRole.USER)
print("OpenAI-compatible user message:", openai_user_msg)

# 将助手消息转化为OpenAI后端的助手消息
openai_assistant_msg = assistant_msg.to_openai_assistant_message()
print("OpenAI-compatible assistant message:", openai_assistant_msg)
```

在发送消息时，可以在 `BaseMessage` 中包含图片列表或自定义的 `meta_dict` 信息，帮助 `ChatAgent` 理解上下文或额外提示。`meta_dict` 主要用于系统内部，而不是直接的模型交互。可以在复杂的对话系统中进行消息路由和状态管理。

Agent 在与用户交互的过程中，会根据用户的输入生成相应的响应。这些响应不仅包含要显示给用户的消息，还可能包含额外的信息，如会话状态、上下文数据等。`camel.responses` 模块是 CAMEL 框架中处理聊天Agent响应的重要部分。其中`ChatAgentResponse`类用于封装聊天Agent（`ChatAgent`）的交互输出，结构化响应内容，便于开发者访问消息、会话状态等信息。

一个典型的Agent响应通常包括以下几个部分：

- **消息内容（Message Content）**：这是用户直接看到的部分，如文本、图片等。
- **会话状态（Session Status）**：指示会话是否继续、结束或需要进行其他操作。
- **附加信息（Additional Information）**：用于存储上下文数据、调试信息或其他辅助数据。

`ChatAgentResponse` 的类属性包括：
- `msgs`：一个包含 `BaseMessage` 对象的列表，表示Agent生成的消息。根据模式的不同，列表内容会有所不同：
    - 空列表：表示消息生成时出现错误。
    - 单条消息：表示正常的消息生成操作。
    - 多条消息：表示Agent处于“批评者模式”（critic mode）。
- `terminated`：一个布尔值，指示聊天会话是否已经被 Agent 终止。
- `info`：一个字典，包含与会话相关的附加信息，例如使用统计或工具调用信息。

## Memory
在 Agent 系统中，Memory 模块是一个关键的组件，其主要功能是存储和检索信息，以支持 Agent 的学习和决策过程。该模块模拟人类记忆的某些特征，能够动态地保存和更新信息，使 Agent 能够利用过去的经验进行推理和决策。

**为什么要有Memory模块？**
Memory 进行多轮对话了。每次提问都相当于重新开始一个对话，对话就不具备连续性。

Memory 模块通常包括以下几个核心功能：
1. **信息储存**：能够高效存储多种形式的数据，包括事实、事件、规则和上下文信息，以便在需要时快速访问。
2. **信息检索**：支持根据特定查询或上下文快速检索相关信息，帮助agent在需要时做出准确的判断。
3. **记忆更新**：能够根据新的信息和经验动态更新存储内容，以反映环境或任务的变化。
4. **记忆管理**：包括老化机制和优先级管理，确保较重要的信息能够长期保留，而不再需要的信息可以被有效清除，以优化存储资源的使用。

### ChatHistoryBlock
`ChatHistoryBlock` 是一个基于键值存储的聊天历史记忆块实现。
- 使用键值存储后端(BaseKeyValueStorage)
- 支持窗口式检索
- 实现消息权重衰减机制
初始化参数
- `storage`: 存储后端,默认使用`InMemoryKeyValueStorage`
- `keep_rate`: 历史消息权重衰减率,默认 0.9
该模块主要实现了以下方法：
- `retrieve()`：使用可选的窗口大小获取最近的聊天记录
- `write_records()`：将新记录写入聊天记录
- `clear()`：删除所有聊天消息
**keep_rate概述**
`keep_rate`是 CAMEL 记忆系统中用于控制历史消息权重衰减的重要参数。它主要用于调整历史消息在上下文中的重要性。
- 取值范围: [0,1]
- 默认值: 0.9
- 作用对象: 非system消息(system消息始终保持 score=1.0)
它的工作原理是在检索历史消息时:
1. 最新消息的 score 初始值为 1.0
2. 每往前一条消息,score 会乘以 keep_rate
3. 最终每条消息的 score 值决定了其在上下文中的重要性

### VectorDBBlock
`VectorDBBlock` 是一个基于向量数据库的语义记忆块实现。
- 使用向量存储后端（`BaseVectorStorage`）
- 支持语义相似度检索
- 实现消息的向量化存储

**初始化参数**
- `storage`：可选 BaseVectorStorage （默认：`QdrantStorage`)
- `embedding`：可选 BaseEmbedding（默认值：`OpenAIEmbedding`)

该模块主要实现了以下方法：
- `retrieve()`：根据关键字获取相似记录
- `write_records()`：将新记录转换并写入矢量数据库
- `clear()`：从向量数据库中删除所有记录

该模块的工作流程如下：
1. 存储过程:
    - 将消息内容转换为向量表示
    - 生成唯一标识符（UUID）
    - 将向量和原始消息存入向量数据库
2. 检索过程:
    - 将查询关键词转换为向量
    - 在向量空间中搜索相似向量
    - 返回相似度最高的记录
## Tools
工具(Tools)是大语言模型(LLM)与外部世界交互的桥梁。虽然LLM具有强大的语言理解和生成能力,但它们本质上是封闭的语言模型,无法直接:
- 获取实时信息(如天气、新闻)
- 访问外部数据(如数据库、文件)
- 执行具体操作(如发送邮件、控制设备)
为了克服这些限制,我们需要为LLM配备各种工具,使其能够:
- 通过API获取实时数据
- 调用外部服务
- 执行特定任务
- 与其他系统交互
工具充当允许 LLM 与世界交互的接口。工具本质上是一个具有名称、描述、输入参数和输出类型的函数。