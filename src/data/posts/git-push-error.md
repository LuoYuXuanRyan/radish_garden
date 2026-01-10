---
title: 'git push 出错解决'
publishDate: '2024-12-13'
description: 'stack overflow 确实好用～'
introText: '最近在提交代码的时候遇到了以下错误
"... 错误：RPC 失败。HTTP 400 curl 22 The requested URL returned error: 400
send-pack: unexpected disconnect while reading sideband packet ... 致命错误：远端意外挂断了"，
最后在 stack overflow 上找到了解决方案'
author: 'Ryan'
tags: ['Git', 'HTTP', 'Error']
slug: 'git-push-error'
---
# git push 出错解决

最近在提交代码的时候遇到了以下错误

![image-1](./git-push-error.assets/image-1.png)

在网上尝试各种方法，包括设置git代理等，最后在这个[stack overflow帖子](https://stackoverflow.com/questions/78866739/how-to-fix-git-error-rpc-failed-http-400-curl-22-permanently)找到了解决方案

```shell
git config --global http.postBuffer 524288000
```

即永久设置git缓冲区大小为500MB