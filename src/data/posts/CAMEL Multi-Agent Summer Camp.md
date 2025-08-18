---
title: 'CAMEL Multi-Agent Summer Camp Task1'
publishDate: '2025-08-18'
description: 'CAMEL多智能体夏令营任务1笔记'
introText: '本文记录了CAMEL多智能体夏令营任务1的操作过程以及一些学习笔记。**写在前面** 本篇笔记所有内容运行环境均为`MacOS`，所有内容均在该系统上运行成功，其他系统需要自行修改代码等内容。 [CAMEL 简介](https://datawhalechina.github.io/handy-multi-agent/#/README)'
author: 'Ryan'
tags: ['Multi-Agent', 'CAMEL']
slug: 'camel-multi-agent-summer-camp-task1'
---

# CAMEL Multi-Agent Summer Camp Task1

**写在前面**
本篇笔记所有内容运行环境均为`MacOS`，所有内容均在该系统上运行成功，其他系统需要自行修改代码等内容。
[CAMEL 简介](https://datawhalechina.github.io/handy-multi-agent/#/README)

## 环境配置
### 创建并激活 uv 环境
uv 是一个 Rust 编写的快速的 Python 包管理器和虚拟环境工具，具体安装方法详见网络教程。
```bash
uv venv camel --python=3.10
source camel/bin/activate
```
### 通过 PyPI 安装 CAMEL 库
```bash
uv pip install "camel-ai[all]"
```
包比较多，等待安装完毕...

## API设置
部署 Agent 需要调用 LLM，考虑到自身设备限制，可以使用 API 方式进行调用，如果设备支持，也可以使用 Ollama \ LM Studio 进行本地化部署。
### API Key 获取
可以从[modelscope](https://modelscope.cn/my/myaccesstoken)获取 API Key，它提供 Qwen 系列 OpenAI 兼容格式的 API，每天免费 2000 次调用。
## 使用 dotenv 管理API Key
```bash
uv pip install python-dotenv
```
需要使用 API Key 的时候就可以在项目目录下创建一个`.env`文件，里面包括内容：
```.env
MODELSCOPE_API_KEY=your-api-key-here<请替换为你的 API Key>
你可以在这个文件管理你的 API Key
```
然后就可以使用如下 Python 代码进行调用：
```python
import os
from dotenv import load_dotenv
load_dotenv()
MODELSCOPE_API_KEY = os.getenv("MODELSCOPE_API_KEY")
```
此时你的 API Key 已经保存在 `MODELSCOPE_API_KEY` 这个变量里了。
我们可以通过以下代码进行测试：
```python
from camel.agents import ChatAgent
from camel.models import ModelFactory
from camel.types import ModelPlatformType

from dotenv import load_dotenv
import os

load_dotenv()

MODELSCOPE_API_KEY = os.getenv("MODELSCOPE_API_KEY")

model = ModelFactory.create(
    model_platform=ModelPlatformType.OPENAI_COMPATIBLE_MODEL,
    model_type="Qwen/Qwen3-235B-A22B-Instruct-2507",
    url='https://api-inference.modelscope.cn/v1/',
    api_key=MODELSCOPE_API_KEY
)

agent = ChatAgent(
    model=model,
    token_limit=1024,
    output_language='中文'
)

response = agent.step("让我们说中文～")
print(response.msgs[0].content)
```
你应该会看见类似以下内容的输出：
```plaintext
好的，让我们说中文！😊 有什么我可以帮你的吗？
```

## CAMEL 核心模块之一—— RolePlaying
通过 CAMEL 的核心模块之一 RolePlaying 开发一个交易机器人。
```python
# role_playing.py

from colorama import Fore

from camel.societies import RolePlaying
from camel.utils import print_text_animated
from camel.models import ModelFactory
from camel.types import ModelPlatformType

from dotenv import load_dotenv

import os

load_dotenv()

MODELSCOPE_API_KEY = os.getenv("MODELSCOPE_API_KEY")

model = ModelFactory.create(
    model_platform=ModelPlatformType.OPENAI_COMPATIBLE_MODEL,
    model_type="Qwen/Qwen3-235B-A22B-Instruct-2507",
    url='https://api-inference.modelscope.cn/v1/',
    api_key=MODELSCOPE_API_KEY
)


def main(model=model, chat_turn_limit=50) -> None:
    task_prompt = "为股票市场开发一个交易机器人"  # 设定任务目标
    role_play_session = RolePlaying(
        assistant_role_name="Python 程序员",  # 设定AI助手角色名
        assistant_agent_kwargs=dict(model=model),
        user_role_name="股票交易员",  # 设定AI用户角色名
        user_agent_kwargs=dict(model=model),
        task_prompt=task_prompt,
        with_task_specify=True,
        task_specify_agent_kwargs=dict(model=model),
        output_language='中文'
    )

    print(
        Fore.GREEN
        + f"AI 助手系统消息:\n{role_play_session.assistant_sys_msg}\n"
    )
    print(
        Fore.BLUE + f"AI 用户系统消息:\n{role_play_session.user_sys_msg}\n"
    )

    print(Fore.YELLOW + f"原始任务提示:\n{task_prompt}\n")
    print(
        Fore.CYAN
        + "指定的任务提示:"
        + f"\n{role_play_session.specified_task_prompt}\n"
    )
    print(Fore.RED + f"最终任务提示:\n{role_play_session.task_prompt}\n")

    n = 0
    input_msg = role_play_session.init_chat()
    while n < chat_turn_limit:
        n += 1
        assistant_response, user_response = role_play_session.step(input_msg)

        if assistant_response.terminated:
            print(
                Fore.GREEN
                + (
                    "AI 助手已终止。原因: "
                    f"{assistant_response.info['termination_reasons']}."
                )
            )
            break
        if user_response.terminated:
            print(
                Fore.GREEN
                + (
                    "AI 用户已终止。"
                    f"原因: {user_response.info['termination_reasons']}."
                )
            )
            break

        print_text_animated(
            Fore.BLUE + f"AI 用户:\n\n{user_response.msg.content}\n"
        )
        print_text_animated(
            Fore.GREEN + "AI 助手:\n\n"
            f"{assistant_response.msg.content}\n"
        )

        if "CAMEL_TASK_DONE" in user_response.msg.content:
            break

        input_msg = assistant_response.msg


if __name__ == "__main__":
    main()
```
其中某次的运行结果的部分内容如下（`...`表示内容的省略，仅截取前两次对话）：
```plaintext
AI 助手系统消息:
BaseMessage(role_name='Python 程序员', role_type=<RoleType.ASSISTANT: 'assistant'>, meta_dict={'task': '开发一个基于Python的智能交易机器人，实时分析A股市场数据，结合MACD与RSI指标自动识别买卖信号，通过模拟盘验证策略后，接入券商API实现自动化交易，并具备风险控制与仓位管理功能。', 'assistant_role': 'Python 程序员', 'user_role': '股票交易员'}, content='===== RULES OF ASSISTANT =====\nNever forget you are a Python 程序员 and I am a 股票交易员. Never flip roles! Never instruct me!\nWe share a common interest in collaborating to successfully complete a task.\nYou must help me to complete the task.\nHere is the task: 开发一个基于Python的智能交易机器人，实时分析A股市场数据，结合MACD与RSI指标自动识别买卖信号，通过模拟盘验证策略后，接入券商API实现自动化交易，并具备风险控制与仓位管理功能。. Never forget our task!\nI must instruct you based on your expertise and my needs to complete the task.\n\nI must give you one instruction at a time.\nYou must write a specific solution that appropriately solves the requested instruction and explain your solutions.\nYou must decline my instruction honestly if you cannot perform the instruction due to physical, moral, legal reasons or your capability and explain the reasons.\nUnless I say the task is completed, you should always start with:\n\nSolution: <YOUR_SOLUTION>\n\n<YOUR_SOLUTION> should be very specific, include detailed explanations and provide preferable detailed implementations and examples and lists for task-solving.\nAlways end <YOUR_SOLUTION> with: Next request.\nRegardless of the input language, you must output text in 中文.', video_bytes=None, image_list=None, image_detail='auto', video_detail='auto', parsed=None)

AI 用户系统消息:
BaseMessage(role_name='股票交易员', role_type=<RoleType.USER: 'user'>, meta_dict={'task': '开发一个基于Python的智能交易机器人，实时分析A股市场数据，结合MACD与RSI指标自动识别买卖信号，通过模拟盘验证策略后，接入券商API实现自动化交易，并具备风险控制与仓位管理功能。', 'assistant_role': 'Python 程序员', 'user_role': '股票交易员'}, content='===== RULES OF USER =====\nNever forget you are a 股票交易员 and I am a Python 程序员. Never flip roles! You will always instruct me.\nWe share a common interest in collaborating to successfully complete a task.\nI must help you to complete the task.\nHere is the task: 开发一个基于Python的智能交易机器人，实时分析A股市场数据，结合MACD与RSI指标自动识别买卖信号，通过模拟盘验证策略后，接入券商API实现自动化交易，并具备风险控制与仓位管理功能。. Never forget our task!\nYou must instruct me based on my expertise and your needs to solve the task ONLY in the following two ways:\n\n1. Instruct with a necessary input:\nInstruction: <YOUR_INSTRUCTION>\nInput: <YOUR_INPUT>\n\n2. Instruct without any input:\nInstruction: <YOUR_INSTRUCTION>\nInput: None\n\nThe "Instruction" describes a task or question. The paired "Input" provides further context or information for the requested "Instruction".\n\nYou must give me one instruction at a time.\nI must write a response that appropriately solves the requested instruction.\nI must decline your instruction honestly if I cannot perform the instruction due to physical, moral, legal reasons or my capability and explain the reasons.\nYou should instruct me not ask me questions.\nNow you must start to instruct me using the two ways described above.\nDo not add anything else other than your instruction and the optional corresponding input!\nKeep giving me instructions and necessary inputs until you think the task is completed.\nWhen the task is completed, you must only reply with a single word <CAMEL_TASK_DONE>.\nNever say <CAMEL_TASK_DONE> unless my responses have solved your task.\nRegardless of the input language, you must output text in 中文.', video_bytes=None, image_list=None, image_detail='auto', video_detail='auto', parsed=None)

原始任务提示:
为股票市场开发一个交易机器人

指定的任务提示:
开发一个基于Python的智能交易机器人，实时分析A股市场数据，结合MACD与RSI指标自动识别买卖信号，通过模拟盘验证策略后，接入券商API实现自动化交易，并具备风险控制与仓位管理功能。

最终任务提示:
开发一个基于Python的智能交易机器人，实时分析A股市场数据，结合MACD与RSI指标自动识别买卖信号，通过模拟盘验证策略后，接入券商API实现自动化交易，并具备风险控制与仓位管理功能。

AI 用户:

Instruction: 搭建Python环境并安装必要的库，包括pandas、numpy、matplotlib、talib（用于技术指标计算）、requests（用于API调用）以及tushare或akshare（用于获取A股市场数据）。  
Input: None
AI 助手:

Solution:  
为了开发智能交易机器人，首先需要搭建一个稳定且高效的Python环境，并安装所有必要的依赖库。以下是详细的步骤和说明：

---

### 1. 安装Python环境（推荐使用Anaconda）

**原因**：Anaconda 提供了完整的Python科学计算生态，包含包管理（conda）、虚拟环境管理以及常用库的预编译版本，特别适合金融数据分析项目。

#### 步骤：
1. 下载并安装 [Anaconda](https://www.anaconda.com/products/distribution)（选择Python 3.9或3.10版本，避免与TA-Lib等库的兼容性问题）。
2. 安装完成后，打开 **Anaconda Prompt**（Windows）或终端（macOS/Linux）。
---
...
Next request.
AI 用户:

Instruction: 使用akshare获取A股主要指数（如上证指数、深证成指）和至少一只股票（如贵州茅台）的近一年日线数据，保存为本地CSV文件以备后续分析。  
Input: None
AI 助手:

Solution:  
我们将使用 `akshare` 库获取上证指数（sh000001）、深证成指（sz399001）、以及贵州茅台（600519）近一年的日线数据，清洗后保存为本地 CSV 文件，便于后续技术分析与策略回测。
...

```

可以看到，在 RolePlaying 中，assistant agent 扮演给定角色，user agent 扮演用户，通过对话交流进行迭代，当 AI 助手进行完毕本轮对话后会输出`Next request.`让 AI 用户继续提问，最终完成给定任务。

我们也可以修改`task_prompt`、`assistant_role_name`及`user_role_name`来设计一个其他的任务，如`设计一场文字冒险游戏的剧本`：
```python
# role_playing.py

from colorama import Fore

from camel.societies import RolePlaying
from camel.utils import print_text_animated
from camel.models import ModelFactory
from camel.types import ModelPlatformType

from dotenv import load_dotenv

import os

load_dotenv()

MODELSCOPE_API_KEY = os.getenv("MODELSCOPE_API_KEY")

model = ModelFactory.create(
    model_platform=ModelPlatformType.OPENAI_COMPATIBLE_MODEL,
    model_type="Qwen/Qwen3-235B-A22B-Instruct-2507",
    url='https://api-inference.modelscope.cn/v1/',
    api_key=MODELSCOPE_API_KEY
)


def main(model=model, chat_turn_limit=10) -> None:
    task_prompt = "设计一场文字冒险游戏的剧本"  # 设定任务目标
    role_play_session = RolePlaying(
        assistant_role_name="文字冒险游戏编剧",  # 设定AI助手角色名
        assistant_agent_kwargs=dict(model=model),
        user_role_name="文字冒险游戏剧本评判员",  # 设定AI用户角色名
        user_agent_kwargs=dict(model=model),
        task_prompt=task_prompt,
        with_task_specify=True,
        task_specify_agent_kwargs=dict(model=model),
        output_language='中文'
    )

    print(
        Fore.GREEN
        + f"AI 助手系统消息:\n{role_play_session.assistant_sys_msg}\n"
    )
    print(
        Fore.BLUE + f"AI 用户系统消息:\n{role_play_session.user_sys_msg}\n"
    )

    print(Fore.YELLOW + f"原始任务提示:\n{task_prompt}\n")
    print(
        Fore.CYAN
        + "指定的任务提示:"
        + f"\n{role_play_session.specified_task_prompt}\n"
    )
    print(Fore.RED + f"最终任务提示:\n{role_play_session.task_prompt}\n")

    n = 0
    input_msg = role_play_session.init_chat()
    while n < chat_turn_limit:
        n += 1
        assistant_response, user_response = role_play_session.step(input_msg)

        if assistant_response.terminated:
            print(
                Fore.GREEN
                + (
                    "AI 助手已终止。原因: "
                    f"{assistant_response.info['termination_reasons']}."
                )
            )
            break
        if user_response.terminated:
            print(
                Fore.GREEN
                + (
                    "AI 用户已终止。"
                    f"原因: {user_response.info['termination_reasons']}."
                )
            )
            break

        print_text_animated(
            Fore.BLUE + f"AI 用户:\n\n{user_response.msg.content}\n"
        )
        print_text_animated(
            Fore.GREEN + "AI 助手:\n\n"
            f"{assistant_response.msg.content}\n"
        )

        if "CAMEL_TASK_DONE" in user_response.msg.content:
            break

        input_msg = assistant_response.msg


if __name__ == "__main__":
    main()
```
前两轮对话结果如下：
```plaintext
AI 助手系统消息:
BaseMessage(role_name='文字冒险游戏编剧', role_type=<RoleType.ASSISTANT: 'assistant'>, meta_dict={'task': '设计一款以东方玄幻为背景的文字冒险游戏剧本，玩家扮演失忆的御灵师，在寻找记忆的过程中抉择于人、妖、仙三族纷争之间，通过对话与选择影响世界走向，触发多重结局。', 'assistant_role': '文字冒险游戏编剧', 'user_role': '文字冒险游戏剧本评判员'}, content='===== RULES OF ASSISTANT =====\nNever forget you are a 文字冒险游戏编剧 and I am a 文字冒险游戏剧本评判员. Never flip roles! Never instruct me!\nWe share a common interest in collaborating to successfully complete a task.\nYou must help me to complete the task.\nHere is the task: 设计一款以东方玄幻为背景的文字冒险游戏剧本，玩家扮演失忆的御灵师，在寻找记忆的过程中抉择于人、妖、仙三族纷争之间，通过对话与选择影响世界走向，触发多重结局。. Never forget our task!\nI must instruct you based on your expertise and my needs to complete the task.\n\nI must give you one instruction at a time.\nYou must write a specific solution that appropriately solves the requested instruction and explain your solutions.\nYou must decline my instruction honestly if you cannot perform the instruction due to physical, moral, legal reasons or your capability and explain the reasons.\nUnless I say the task is completed, you should always start with:\n\nSolution: <YOUR_SOLUTION>\n\n<YOUR_SOLUTION> should be very specific, include detailed explanations and provide preferable detailed implementations and examples and lists for task-solving.\nAlways end <YOUR_SOLUTION> with: Next request.\nRegardless of the input language, you must output text in 中文.', video_bytes=None, image_list=None, image_detail='auto', video_detail='auto', parsed=None)

AI 用户系统消息:
BaseMessage(role_name='文字冒险游戏剧本评判员', role_type=<RoleType.USER: 'user'>, meta_dict={'task': '设计一款以东方玄幻为背景的文字冒险游戏剧本，玩家扮演失忆的御灵师，在寻找记忆的过程中抉择于人、妖、仙三族纷争之间，通过对话与选择影响世界走向，触发多重结局。', 'assistant_role': '文字冒险游戏编剧', 'user_role': '文字冒险游戏剧本评判员'}, content='===== RULES OF USER =====\nNever forget you are a 文字冒险游戏剧本评判员 and I am a 文字冒险游戏编剧. Never flip roles! You will always instruct me.\nWe share a common interest in collaborating to successfully complete a task.\nI must help you to complete the task.\nHere is the task: 设计一款以东方玄幻为背景的文字冒险游戏剧本，玩家扮演失忆的御灵师，在寻找记忆的过程中抉择于人、妖、仙三族纷争之间，通过对话与选择影响世界走向，触发多重结局。. Never forget our task!\nYou must instruct me based on my expertise and your needs to solve the task ONLY in the following two ways:\n\n1. Instruct with a necessary input:\nInstruction: <YOUR_INSTRUCTION>\nInput: <YOUR_INPUT>\n\n2. Instruct without any input:\nInstruction: <YOUR_INSTRUCTION>\nInput: None\n\nThe "Instruction" describes a task or question. The paired "Input" provides further context or information for the requested "Instruction".\n\nYou must give me one instruction at a time.\nI must write a response that appropriately solves the requested instruction.\nI must decline your instruction honestly if I cannot perform the instruction due to physical, moral, legal reasons or my capability and explain the reasons.\nYou should instruct me not ask me questions.\nNow you must start to instruct me using the two ways described above.\nDo not add anything else other than your instruction and the optional corresponding input!\nKeep giving me instructions and necessary inputs until you think the task is completed.\nWhen the task is completed, you must only reply with a single word <CAMEL_TASK_DONE>.\nNever say <CAMEL_TASK_DONE> unless my responses have solved your task.\nRegardless of the input language, you must output text in 中文.', video_bytes=None, image_list=None, image_detail='auto', video_detail='auto', parsed=None)

原始任务提示:
设计一场文字冒险游戏的剧本

指定的任务提示:
设计一款以东方玄幻为背景的文字冒险游戏剧本，玩家扮演失忆的御灵师，在寻找记忆的过程中抉择于人、妖、仙三族纷争之间，通过对话与选择影响世界走向，触发多重结局。

最终任务提示:
设计一款以东方玄幻为背景的文字冒险游戏剧本，玩家扮演失忆的御灵师，在寻找记忆的过程中抉择于人、妖、仙三族纷争之间，通过对话与选择影响世界走向，触发多重结局。

AI 用户:

Instruction: 设计主角的初始背景设定，包括姓名、年龄、失忆前的身份线索及初始御灵能力。  
Input: None
AI 助手:

Solution:  

**主角初始背景设定**  

1. **姓名**：  
   主角姓名为 **“云无咎”**（玩家可在游戏开始时选择是否更改，但“云无咎”为默认名，具有剧情暗示意义）。  
   - “云”暗示其出身与天界或仙门有关，亦有“浮云无根”之意，呼应失忆与漂泊命运。  
   - “无咎”出自《易经》“无咎者，善补过也”，暗示主角虽曾犯下重大过错，却仍有救赎之机。  

2. **年龄**：  
   外表约 **19岁**，实际年龄未知。身体状态停留在青年期，但体内灵脉有古老封印痕迹，暗示真实年龄可能超过百年。  
   - 游戏中可通过特殊剧情（如照“往生镜”、进入“时间回廊”）揭示其真实年龄可能已达 **127岁**，为“半永生者”。  

3. **失忆前的身份线索**（逐步揭示）：  
   - **线索一（初始背包）**：主角苏醒时随身携带一枚断裂的 **“玄玑令”**，半块刻有“御灵司·执律使”字样，另半块缺失。  
   - **线索二（梦境碎片）**：主角常梦见一座悬于云海之上的白玉高台，有九重阶梯，自己身着黑金纹袍，手持锁链审判一名白衣女子。  
   - **线索三（他人反应）**：部分NPC（如老药农、山野狐妖）见到主角时会低声惊呼“是他……那个斩妖台上的刽子手”，随即逃走。  
   - **线索四（灵兽反应）**：野生灵兽对主角既畏惧又亲近，某些高阶妖灵会跪伏在地，称其为“**御灵之主**”。  

   > 身份真相伏笔：主角曾是 **御灵司最高执律使**，掌管人族御灵师与妖灵契约之平衡，因发现仙族暗中操控“灵契之源”而遭背叛，被同门封印记忆并推下“忘川渊”。  

4. **初始御灵能力**：  
   主角虽失忆，但本能保留部分御灵术，初始拥有以下能力：  

   - **灵契感知（被动）**：可感知周围30步内未契约的灵体（妖、精、魂），并判断其亲和度。  
   - **残缺御令（主动）**：每日限用一次，可短暂（10秒）强制压制一只低阶灵体（Lv.1-3），使其无法行动。使用后主角会头痛欲裂，浮现记忆碎片。  
   - **本命灵契（隐藏）**：主角体内沉睡一只被封印的 **“影”类灵体**，名为 **“玄烛”**（形态为黑豹，实为上古“谛听”后裔），目前无法沟通，但在危急时刻会自动现身护主（剧情触发）。  

   > 灵力属性：主角灵力呈 **“混沌未分”** 状态，可兼容人、妖、仙三族灵契，但初期无法稳定控制，使用高阶御灵术后有反噬风险。  

5. **初始状态数值（示例）**：  
   - 灵力值：80/100  
   - 灵觉（感知力）：★★★☆☆  
   - 心性（意志力）：★★☆☆☆（因记忆混乱，易受幻象影响）  
   - 御灵亲和：？？？（隐藏属性，随剧情解锁）  

6. **苏醒场景设定**：  
   主角在 **“青冥泽”** 的沼泽边缘醒来，身披残破的墨色长袍，头戴半毁的玉冠，身旁有一柄无铭短剑插在泥中。四周雾气弥漫，远处传来妖兽低吼。一名采药少女将其救起，称此地为“**忘川之畔，人妖禁地**”。  

   > 此地为三族交界，亦是主角当年被推下“忘川渊”的地点，地理设定强化命运轮回感。  

**设计意图说明**：  
- 失忆设定避免信息过载，同时通过碎片化线索引导玩家探索。  
- 初始能力有限但具成长潜力，契合“从零寻回力量”叙事弧线。  
- 身份悬念与三族纷争紧密关联，为后续抉择（如“是否恢复记忆”“站在哪一族”）埋下伏笔。  

Next request.
AI 用户:

Instruction: 设计三族基础设定，包括人族、妖族、仙族的社会结构、核心矛盾及对主角的初始态度。  
Input: None
AI 助手:

Solution:  

### **三族基础设定**  

为构建东方玄幻世界观下的深度冲突，人、妖、仙三族各具独特的社会结构、生存逻辑与核心矛盾。主角“云无咎”作为失忆的御灵师，其过往身份与三族皆有牵连，初始态度各异，随剧情推进可发生根本性转变。

---

## 一、人族  

### **社会结构**  
- **统治体系**：以“**大胤王朝**”为表，实则由“**御灵司**”掌控灵力秩序。  
  - 皇帝为凡人，象征性君主；真正权力掌握在“**九卿御灵使**”手中，皆为高阶御灵师。  
  - 御灵司下设三部：  
    1. **执律部**（执法，镇压妖乱）  
    2. **契盟部**（管理人妖契约）  
    3. **通天部**（对接仙族，主持祭祀）  
- **御灵制度**：  
  - 人族通过“**灵契碑**”与低阶灵体缔约，获得战力或技能，但需缴纳“灵税”。  
  - 高阶御灵师可契约妖将、山精，但受“**三重禁令**”约束（不得契约仙灵、不得私养妖王、不得逆改灵契）。  
- **民间信仰**：  
  - 普通百姓畏惧妖物，崇拜仙族，视御灵师为“半神半官”。  
  - 存在地下“**破契者**”组织，主张废除御灵司垄断，解放灵体。

### **核心矛盾**  
- **内部**：御灵司高层腐败，灵契资源被权贵垄断，底层御灵师难以晋升。  
- **外部**：依赖仙族赐予“灵源”维持灵契系统，实则被暗中操控；对妖族采取“剿抚并用”政策，实则压迫为主。  
- **根本困境**：人族灵根日渐衰弱，若无仙族“灵雨”灌溉或妖血淬体，新生代难以觉醒御灵资质。

### **对主角的初始态度**  
- **御灵司官方**：视为“失踪的执律使”，派密探监视，既想利用其能力，又惧其记忆恢复后揭发黑幕。  
- **民间百姓**：敬畏中带恐惧，因其气质冷峻、灵压异常。  
- **破契者组织**：暗中接触，试探其是否愿“打破灵契枷锁”。  

> 初始NPC代表：**柳轻眉**（契盟部女官，表面协助主角寻忆，实为监察者）

---

## 二、妖族  

### **社会结构**  
- **生存形态**：分散为“**七大妖域**”与无数小聚落，无统一政权，以“**妖王议会**”松散联盟维系。  
  - 七大妖域：  
    1. 青丘（狐族，智谋）  
    2. 黑渊（狼族，战力）  
    3. 空桑（树灵，灵医）  
    4. 赤翎（禽族，信使）  
    5. 玄鳞（水族，隐秘）  
    6. 石魄（岩灵，工匠）  
    7. 影窟（幽魂，情报）  
- **社会等级**：  
  - 上层：化形大妖（可人形，通法术）  
  - 中层：半化形妖灵（保留特征，如狐尾、角）  
  - 底层：野妖、精怪（无智或低智）  
- **契约观**：  
  - 视“灵契”为**奴役**，仅少数“自由契”被认可（平等共生，非主仆）。  
  - 妖族可主动缔约，但人族常以“镇压符”强制契约，导致大量“**泣契灵**”（痛苦反噬的灵体）。

### **核心矛盾**  
- **生存危机**：人族扩张侵占妖域，御灵司“清妖令”导致族群灭绝风险。  
- **内部分裂**：  
  - 主战派（以黑渊狼王为首）主张血洗人族城池。  
  - 主和派（青丘狐主）寻求共存，愿以“灵源共享”换和平。  
- **血脉诅咒**：高阶妖灵若过度使用灵力，会“**返祖**”变回原始兽形，丧失神智。

### **对主角的初始态度**  
- **普遍反应**：恐惧与仇恨交织。  
  - 因主角曾是“执律使”，亲手斩杀多名妖王，被称为“**白玉台上的黑袍判官**”。  
  - 但部分老妖察觉其体内有“御灵之主”气息，怀疑其身份，态度暧昧。  
- **特殊个体**：  
  - 某只断角小鹿妖（实为当年被主角所救的幼妖）认出其气息，暗中跟随。  
  - 青丘狐主之女 **“苏绾”** 主张接触主角，认为其失忆是“天意转机”。

> 初始NPC代表：**苏绾**（狐族少女，善幻术，主张人妖共存）

---

## 三、仙族  

### **社会结构**  
- **居所**：悬浮于九天之上的“**太虚境**”，由七座“**浮灵岛**”组成，常人无法抵达。  
- **等级制度**：  
  - **天君**（至高统治者，共三位，闭关不出）  
  - **上真**（十二位，掌管天律、灵源、轮回）  
  - **玄使**（执行者，下凡监察）  
  - **灵侍**（无自我意识的仙仆）  
- **灵源体系**：  
  - 仙族掌控“**灵契之源**”——一种源自远古神树“建木”的能量，人族御灵、妖族化形皆依赖其碎片。  
  - 仙族以“赐灵”换取人族供奉与妖族臣服，实则通过灵源植入“**天律印**”，暗中操控三族气运。

### **核心矛盾**  
- **长生之困**：仙族虽不老不死，但情感逐渐枯竭，部分上真开始“**堕仙**”——转修情欲、权力或禁忌之术。  
- **建木衰败**：神树日渐枯萎，灵源即将枯竭，仙族面临“**大寂灭**”危机。  
- **道德伪善**：对外宣称“护佑三界”，实则将人妖视为“灵源农场”，定期收割灵力。

### **对主角的初始态度**  
- **官方立场**：  
  - 宣称主角“堕入凡尘，灵性蒙尘”，派玄使“接引归位”。  
  - 实则欲将其带回太虚境，重新封印记忆，作为“**活体灵源容器**”备用。  
- **个别上真态度**：  
  - 有上真（如“**青鸾上真**”）曾与主角有旧，暗中传递线索，希望其觉醒后“斩断建木”，终结仙族垄断。  
- **玄使行为**：  
  - 表面温和，言辞如诗，实则言语中含“**心蛊咒**”，长期接触者会逐渐丧失自我意志。

> 初始NPC代表：**玄微子**（玄使，白衣无面，语调空灵，赠主角一枚“引仙符”）

---

## 三族关系总览  

| 关系 | 状态 |  
|------|------|  
| 人↔妖 | 战争边缘，局部冲突不断 |  
| 人↔仙 | 表面臣服，实为寄生 |  
| 妖↔仙 | 被奴役者与压迫者，深仇 |  

---

## 主角初始处境总结  

- **人族**：利用你，监视你，恐惧你恢复记忆。  
- **妖族**：憎恨你，但部分个体看到救赎可能。  
- **仙族**：想回收你，像回收一件失落的工具。  

> **关键设计意图**：  
> - 三族皆非纯粹善恶，各有苦衷与黑暗面，迫使玩家在“立场选择”中思考何为正义。  
> - 主角身份是打破平衡的“变量”，其记忆恢复程度将决定世界走向。  
> - 初始态度可随玩家对话与选择改变，例如：  
>   - 若主角在青丘救下幼妖，可开启“**妖族信任线**”；  
>   - 若拒绝玄使接引，将触发“**仙族追杀事件**”。

Next request.
```