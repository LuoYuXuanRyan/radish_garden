---
title: 'RAGFlow本地部署教程（Windows篇）'
publishDate: '2025-2-27'
description: 'RAGFlow 防踩坑必看'
introText: 'RAG（Retrieval-Augmented Generation，检索增强生成）是一种结合了信息检索（Retrieval）和自然语言生成（Generation）的技术框架。它通过从外部知识库中检索相关信息，并将其作为上下文输入到大型语言模型（LLM）中，从而增强模型生成回答的准确性、相关性和可解释性。RAGFlow是一个基于深度文档理解的开源RAG（检索增强生成）引擎。当与LLM集成时，它能够提供真实的问答能力，并得到来自各种复杂格式数据的充分引用的支持。'
author: 'Ryan'
tags: ['llm', 'RAG']
slug: 'ragflow-local-deployment-windows'
---

# RAGFlow本地部署教程（Windows篇）

> 本教程参考[官方文档](https://ragflow.io/docs/dev/)和[Datawhale教程](https://mp.weixin.qq.com/s/p6iwPz3LCv3QI7d-b2u1rA)编写

RAG（Retrieval-Augmented Generation，检索增强生成）是一种结合了信息检索（Retrieval）和自然语言生成（Generation）的技术框架。它通过从外部知识库中检索相关信息，并将其作为上下文输入到大型语言模型（LLM）中，从而增强模型生成回答的准确性、相关性和可解释性。

RAGFlow是一个基于深度文档理解的开源RAG（检索增强生成）引擎。当与LLM集成时，它能够提供真实的问答能力，并得到来自各种复杂格式数据的充分引用的支持。

## 环境与配置

本教程基于Windows11系统编写。

官方配置要求：

- CPU ≥ 4 cores (x86)
- RAM ≥ 16 GB
- Disk ≥ 50 GB（注意，由于WSL默认安装在C盘，而Docker的文件会安装在WSL中，所以请至少给C盘留有50GB以上的空间，防止像笔者一样C盘爆炸）
- Docker ≥ 24.0.0 & Docker Compose ≥ v2.26.1

请事先准备好科学的网络环境，并自行下载安装[Git](https://git-scm.com/downloads)，[Vscode](https://code.visualstudio.com)，[WSL](https://learn.microsoft.com/zh-cn/windows/wsl/install)，[Docker](https://docs.docker.com/desktop/setup/install/windows-install/)。

## 正式开始

### 启动服务器

1、保证`vm.max_map_count`>=262144

设置最大内存映射数量不小于262144，这个值的默认值为262144。过小的值可能导致内存异常。

进入`C:/user/<username>/`目录，编辑（如果没有则创建）`.wslconfig`文件。

```powershell
[wsl2]
kernelCommandLine = "sysctl.vm.max_map_count=262144"
```

2、clone RAGFlow代码

一个除了C盘的位置（如果你只有C盘这1个盘那就在这里吧），右键单击选择`在终端中打开`，在`Bash`中逐行输入：

```bash
git clone https://github.com/infiniflow/ragflow.git
cd ragflow/docker
git checkout -f v0.16.0
code .
```

此时会自动打开VScode，找到`.env`文件，修改第84行，在最前面加上`#`，第87行最前面删除`#`。保存文件。

3、拉取Docker映像

在刚刚的终端中输入

```
docker compose -f docker-compose.yml up -d
```

等待docker自动拉取映像，此时一定要保证科学网络环境良好，多次出现错误是正常的现象，更换节点重新输入命令拉取即可。

4、启动服务器

拉取完毕后，输入

```powe
docker logs -f ragflow-server
```

如果看到

```pow
     ____   ___    ______ ______ __
    / __ \ /   |  / ____// ____// /____  _      __
   / /_/ // /| | / / __ / /_   / // __ \| | /| / /
  / _, _// ___ |/ /_/ // __/  / // /_/ /| |/ |/ /
 /_/ |_|/_/  |_|\____//_/    /_/ \____/ |__/|__/

```

这样的画面就是服务启动成功了。

笔者在这里还遇到过`exec ./entrypoint.sh: exec format error`。如果你是ARM架构的电脑，类似于[这个issue](https://github.com/infiniflow/ragflow/issues/5332)，你需要自行构建Docker映像，请参考[该文章](https://ragflow.io/docs/dev/build_docker_image)，如果你和笔者一样是x86_64架构的电脑，可以考虑重新clone代码（这个问题笔者也没有成功解决，但是重新clone代码后没有遇到这个错误）。

5、打开交互界面

打开浏览器，输入

```url
localhost:80
```

即可进入RAGFlow的web交互界面。注册登录后即可开始使用RAGFlow。

## 配置LLM

以使用Deepseek模型为例。

1、点击右上角`English`可以选择界面语言。点击右上角头像，点击`模型提供商`，点击模型卡片的`添加模型`，输入API-Key([可以在这里获取](https://platform.deepseek.com/usage))，确定后即可保存语言模型。

2、回到页面最上方，点击`系统模型设置`，选择聊天模型为`deepseek-chat`，其他保持默认不变，点击`确认`保存。

3、点击`知识库`，选择`创建知识库`，输入名称，点击`确定`，然后在弹出的页面设置参数（记得设置知识库语言）后点击`保存`(在页面最下方)，一个新知识库就创建好了。

4、点击`+新建文件`，即可上传文件，上传成功后点击绿色“播放”按钮开始解析，等待解析完成后，这个文件就加入你的知识库里了。

## 设置AI助理并进行对话

点击`聊天`，点击`创建助理`，输入名称并设置参数（记得选择知识库）然后保存，然后新建对话，就可以开始和AI助理就你的知识库进行对话了！效果还是不错的。

**在这一步你可能遇到的问题**

- 成功解析文件，但是无法进行聊天或者看不到产生的chunk：可能是后端内存太小，需要增加WSL可以使用的内存，请参考[这篇文章](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config#wslconfig)。笔者是将WSL的内存设置成了11GB。
  你的.wslconfig文件可能会增加这些内容：

  ```config
  [wsl2]
  memory=11GB
  ```

- 卡在解析文件的过程：如果是卡在开始阶段，请参考[这篇文章](https://ragflow.io/docs/dev/faq#why-does-my-document-parsing-stall-at-under-one-percent)；如果是卡在后期，请参考[这篇文章](https://ragflow.io/docs/dev/faq#why-does-my-pdf-parsing-stall-near-completion-while-the-log-does-not-show-any-error)

- 其他问题，请参考[FAQ](https://ragflow.io/docs/dev/faq)和[GitHub Issues](https://github.com/infiniflow/ragflow/issues)

## 碎碎念

安装这个RAGFlow花了我差不多13个小时，一开始是拉取Docker映像时C盘爆满，清理半天C盘，然后发现根本清不干净，遂格式化D盘然后将C、D盘合并，但是因为格式化前没有清理干净导致Git安装不了，所以又去重置了一遍系统。然后Docker映像也是半天下载不下来，好不容易打开web界面解析完文件又不能对话。

于是笔者写了这篇博客教程，帮助更多需要本地部署RAG的朋友避免踩坑。
