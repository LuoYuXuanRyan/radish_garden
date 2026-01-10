---
title: '图像标准化'
publishDate: '2024-12-11'
description: 'torchvision.transforms.Normalize 是一个进行图像标准化的类。'
introText: ' torchvision.transforms.Normalize 是一个进行图像标准化的类。它的作用是对图像中的每个像素做标准化(normalization)处理,这通常可以提高模型的训练效果。'
author: 'Ryan'
tags: ['Python', 'PyTorch']
slug: 'image-normalization'
---

# 图像标准化

`torchvision.transforms.Normalize` 是一个进行图像标准化的类。

它的作用是对图像中的每个像素做标准化(normalization)处理,这通常可以提高模型的训练效果。

这个标准化的公式如下:

$output[channel] = \frac{(input[channel] - mean[channel])}{std[channel]}$

其中:

- input: 输入的图像
- output: 标准化后的输出图像  
- mean: 图像数据集在每个通道上的均值
- std: 图像数据集在每个通道上的标准差

所以在这里:

- `[0.485, 0.456, 0.406]` 表示的是一个3通道(RGB)图像数据集在每个通道上的均值
- `[0.229, 0.224, 0.225]` 表示的是每个通道上的标准差

将输入图像用这些均值和标准差进行标准化,可以减少不同图像因光照等条件变化导致的数值方面的差异,使模型更容易学习到图像的实质内容。

所以这个`Normalize`对象会对传入的图像做标准化处理,从而提高模型效果。



以 ImageNet 数据集为例,其preprocessor通常用到的均值和标准差就是:

- `Mean = [0.485, 0.456, 0.406]`
- `Std = [0.229, 0.224, 0.225]`

