---
title: React中使用图片
date: 2021/5/10
tags: React
categories: Web前端
introduction: react项目是不能直接用src引入图片路径的，正确的使用图片方法是将图片作为组件导入
---

# React中图片使用方法

## img

```react
import softwareLogo from 'assets/software-logo.svg'

<img src={softwareLogo} alt="" />
```

优点是使用方便，但不好规定样式和图片大小

## svg

```react
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
// 将图片作为一个组件引入
<SoftwareLogo width={'18rem'} color={'rgb(38, 132, 255)'}></SoftwareLogo>
```

轻易的就能改变样式