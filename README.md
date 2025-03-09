# Radish Garden ![Radish Garden Logo](/public/favicon.svg)

Radish Garden是一个使用Astro框架构建的个人博客网站，专注于分享计算机科学和技术相关的知识与见解。

## 项目概述

这是一个由Ryan独立开发的个人博客项目，旨在创建一个符合个人审美、功能完善的博客平台。博客使用Astro作为前端框架，结合TailwindCSS实现了响应式设计，提供了良好的用户体验。

## 特点

- 🚀 基于Astro构建的高性能静态网站
- 🎨 使用TailwindCSS实现的响应式设计
- 📝 支持Markdown格式的博客文章
- 🧮 支持数学公式渲染（通过remark-math和rehype-mathjax）
- 🌓 支持深色/浅色模式切换
- 📱 移动端友好的界面设计
- 📰 支持RSS订阅

## 技术栈

- [Astro](https://astro.build/) - 前端框架
- [React](https://reactjs.org/) - UI组件库
- [TailwindCSS](https://tailwindcss.com/) - CSS框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript超集
- [Motion](https://motion.dev/) - 动画库

## 安装与运行

### 前提条件

- Node.js
- pnpm

### 安装步骤

1. 克隆仓库

```bash
git clone git@github.com:LuoYuXuanRyan/radish_garden.git
cd radish_garden
```

2. 安装依赖

```bash
pnpm install
```

3. 开发模式运行

```bash
pnpm run dev
```

4. 构建项目

```bash
pnpm run build
```

5. 预览构建结果

```bash
pnpm run preview
```

## 项目结构

```
/
├── public/            # 静态资源目录
├── src/
│   ├── components/    # 可复用的UI组件
│   ├── data/          # 博客文章和关于页面的Markdown文件
│   ├── layout/        # 页面布局组件
│   ├── pages/         # 页面路由
│   └── styles/        # 全局样式
├── config.ts          # 网站配置文件
├── astro.config.mjs   # Astro配置
└── tailwind.config.mjs # TailwindCSS配置
```

## 内容管理

博客文章存储在`src/data/posts/`目录下，使用Markdown格式编写。每篇文章需要包含以下前置元数据：

```markdown
---
title: '文章标题'
publishDate: 'YYYY-MM-DD'
description: '文章描述'
introText: '文章引入'
author: '作者名'
tags: ['标签1', '标签2']
slug: '文章slug'
---

文章内容...
```

## 自定义配置

网站的基本配置可以在`config.ts`文件中修改，包括网站标题、描述、作者信息、社交媒体链接等。

## 部署

该项目已配置为可部署到Cloudflare Pages，当前部署地址为：[https://luoyuxuanryan.pages.dev](https://luoyuxuanryan.pages.dev)

## 许可证

[MIT](LICENSE)

## 联系方式

如有任何问题或建议，请通过以下方式联系：

- Email: 1505172926@qq.com
- GitHub: [LuoYuXuanRyan](https://github.com/LuoYuXuanRyan)
```