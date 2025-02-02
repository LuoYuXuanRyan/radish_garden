---
title: '手把手教你用Cursor调教DeepSeek：让AI帮你写会跳舞的代码！'
publishDate: '2025-2-2'
description: '本文由deepseek-r1修改撰写。'
introText: '最近朋友圈被 DeepSeek R1 刷屏了！这个号称「理科生の春天」的AI模型，居然和程序员最爱的智能编辑器 Cursor 官宣联动了！作为一个「能用AI写代码就绝不自己敲键盘」的懒癌晚期博主，今天就带大家玩转这个梦幻组合~'
author: 'Ryan, deepseek-r1'
tags: ['deepseek', 'cursor']
slug: 'cursor-with-deepseek'
---
# 手把手教你用Cursor调教DeepSeek：让AI帮你写会跳舞的代码！

## 写在最前面

**本文由deepseek-r1修改撰写。**

## 当代码编辑器遇上中国版GPT-4：一场奇妙的化学反应 💫

最近朋友圈被[DeepSeek R1](https://api-docs.deepseek.com/zh-cn/news/news250120)刷屏了！这个号称「理科生の春天」的AI模型，居然和程序员最爱的智能编辑器[Cursor](https://www.cursor.com)官宣联动了！作为一个「能用AI写代码就绝不自己敲键盘」的懒癌晚期博主，今天就带大家玩转这个梦幻组合~

### 🛠️ 准备篇：你的Mac需要这些装备
- 操作系统：macOS Sequoia 15.2（其他版本也OK，但博主亲测这个最丝滑（❌）只有这个）
- 灵魂道具：一杯奶茶（调试代码必备能量源）

### ⚡ 三分钟极速安装指南

1. 打开[Cursor官网](https://www.cursor.com)，点击`DOWNLOAD FOR MAC`
2. 双击下载好的`Install Cursor`文件（安装速度比煮泡面还快！）
3. 在应用程序文件夹找到新鲜出炉的Cursor图标🖱️

> 💡 小贴士：安装时记得把奶茶放远点，别让激动的奶茶溅到键盘上！

### 🔧 设置你的AI助手（比搭乐高还简单！）

跟着向导一步步走：
- 语言选中文（让AI用母语和你唠嗑）
- 插件选`Use Extensions`（白嫖VSCode生态真香！）
- 数据隐私选Privacy Mode（保护代码就像保护暗恋对象的心意❤️）

最后在Model设置里切换成我们的主角——**deepseek-r1**！

### 🎮 实战演练：让AI写个会跳舞的物理引擎！
按下`⌘+L`召唤AI对话框，输入这段魔法咒语：

```plaintext
write a Python program that shows a ball bouncing inside a spinning hexagon. The ball should be affected by gravity and friction, and it must bounce off the rotating walls realistically.
```

见证奇迹的时刻到了！DeepSeek秒出一个pygame实现的物理模拟代码。点击右上角`应用`按钮，然后...等等！小球怎么从六边形溜走了？🤔

**不要慌，这正是调教AI的好机会！**
1. 把运行结果截图发给DeepSeek
2. 追加prompt："小球总是逃逸，请修复碰撞检测逻辑"
3. 收到改进版代码后再试——这次小球乖乖跳舞啦！

> 🎉 调教成果：经过两次debug，我们得到完美运行的代码（完整代码见下文）。重点看DeepSeek如何机智地修正了法线向量计算：

```python
import pygame
import math

# 初始化 PyGame
pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

# 物理参数
GRAVITY = 0.5
FRICTION = 0.99
BOUNCE = 0.8
ROTATION_SPEED = 0.02

class Hexagon:
    def __init__(self, center, size):
        self.center = center
        self.size = size
        self.angle = 0
        
    def get_rotated_points(self):
        points = []
        for i in range(6):
            angle_deg = 60 * i + math.degrees(self.angle)
            x = self.center[0] + self.size * math.cos(math.radians(angle_deg))
            y = self.center[1] + self.size * math.sin(math.radians(angle_deg))
            points.append((x, y))
        return points

class Ball:
    def __init__(self, pos):
        self.pos = list(pos)
        self.vel = [0, 0]
        self.radius = 10

    def update(self):
        self.vel[1] += GRAVITY
        self.vel[0] *= FRICTION
        self.vel[1] *= FRICTION
        self.pos[0] += self.vel[0]
        self.pos[1] += self.vel[1]

def closest_point_on_line(p, a, b):
    ap = (p[0]-a[0], p[1]-a[1])
    ab = (b[0]-a[0], b[1]-a[1])
    t = max(0, min(1, (ap[0]*ab[0] + ap[1]*ab[1]) / (ab[0]**2 + ab[1]**2 + 1e-6)))
    return (a[0] + ab[0]*t, a[1] + ab[1]*t)

def check_collision(ball, hexagon):
    points = hexagon.get_rotated_points()
    collision_occurred = False
    
    for i in range(6):
        a = points[i]
        b = points[(i+1)%6]
        closest = closest_point_on_line(ball.pos, a, b)
        dx = closest[0] - ball.pos[0]
        dy = closest[1] - ball.pos[1]
        distance = math.hypot(dx, dy)
        
        if distance < ball.radius:
            collision_occurred = True
            # 计算旋转后的边方向向量
            edge_dir = (b[0]-a[0], b[1]-a[1])
            # 计算正确的法线向量（垂直于边且指向六边形内部）
            normal = (-edge_dir[1], edge_dir[0])  # 旋转90度得到法线
            length = math.hypot(normal[0], normal[1])
            if length == 0:
                continue
            normal = (normal[0]/length, normal[1]/length)  # 单位化
            
            # 确保法线指向六边形内部（从边指向中心）
            to_center = (hexagon.center[0] - closest[0], hexagon.center[1] - closest[1])
            if normal[0]*to_center[0] + normal[1]*to_center[1] < 0:
                normal = (-normal[0], -normal[1])
            
            # 计算相对速度
            dot_product = ball.vel[0]*normal[0] + ball.vel[1]*normal[1]
            # 只处理向内的速度分量
            if dot_product < 0:
                ball.vel[0] -= (1 + BOUNCE) * dot_product * normal[0]
                ball.vel[1] -= (1 + BOUNCE) * dot_product * normal[1]
            
            # 调整位置防止穿透（沿法线方向移动）
            overlap = ball.radius - distance
            ball.pos[0] += overlap * normal[0]
            ball.pos[1] += overlap * normal[1]
    
    # 修改边界限制条件
    if not collision_occurred:
        # 使用更精确的包含检测
        inside = True
        points = hexagon.get_rotated_points()
        for i in range(6):
            a = points[i]
            b = points[(i+1)%6]
            # 计算边的法线方向
            edge = (b[0]-a[0], b[1]-a[1])
            normal = (-edge[1], edge[0])
            normal_length = math.hypot(normal[0], normal[1])
            if normal_length == 0:
                continue
            normal = (normal[0]/normal_length, normal[1]/normal_length)
            
            # 计算点到边的投影
            to_point = (ball.pos[0]-a[0], ball.pos[1]-a[1])
            distance = to_point[0]*normal[0] + to_point[1]*normal[1]
            
            if distance < -ball.radius:  # 在边外侧
                inside = False
                break
        
        if not inside:
            # 给予一个向中心的力而不是直接重置
            to_center = (hexagon.center[0]-ball.pos[0], hexagon.center[1]-ball.pos[1])
            dist = math.hypot(*to_center)
            if dist > 0:
                ball.vel[0] += to_center[0]/dist * 0.5
                ball.vel[1] += to_center[1]/dist * 0.5

# 创建对象
hexagon = Hexagon((WIDTH//2, HEIGHT//2), 200)
ball = Ball((WIDTH//2, HEIGHT//2))

running = True
while running:
    screen.fill((0, 0, 0))
    
    # 处理事件
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # 更新状态
    hexagon.angle += ROTATION_SPEED
    ball.update()
    check_collision(ball, hexagon)
    
    # 绘制六边形
    pygame.draw.polygon(screen, (255,255,255), hexagon.get_rotated_points(), 2)
    
    # 绘制小球
    pygame.draw.circle(screen, (255,0,0), (int(ball.pos[0]), int(ball.pos[1])), ball.radius)
    
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
```

### 💰 隐藏福利：API接入的正确打开方式
虽然目前DeepSeek R1的API平台暂时维护中，但提前剧透：
- 价格比Cursor Pro便宜N倍（约等于白嫖）
- 响应速度堪比闪电侠⚡
- 支持流式输出（看着代码逐行生成超治愈！）

**剧透警报**：等API开放后，博主会第一时间更新接入教程！（先点个收藏防走失⭐）

### 🎁 彩蛋时间
新用户注册Cursor会送Pro试用！快去试试这些玩法：
- 用语音指令写代码（真正的动口不动手）
- 让AI解释你看不懂的祖传代码
- 一键生成单元测试（从此告别debug地狱）

---

**快来评论区晒出你的调教成果吧！** 遇到任何问题都可以提问，博主24小时高强度网上冲浪🏄‍♂️ 说不定下期教程就用你的案例当素材哦~