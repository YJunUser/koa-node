---
title: 常用的style样式
date: 2021/6/3
tags: Css
categories: Web前端
introduction: 记录一下做项目时经常用到的样式
---


<code> background-color: rgb(244, 245, 247); </code>用于背景是纯白的灰色

<code>box-shadow: rgba(0,0,0,0.1) 0 0 10px;</code> 四周的阴影

```typescript
// 滚动条，只在当前组件滚动，其余地方不滚动
const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
```

