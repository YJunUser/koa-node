---
title: 如何正确的写一个react页面
date: 2021/5/29
tags: React
introduction: react实在是太灵活，导致我学习的时候一直找不到一个最佳实践，但还是摸索出了一点自己的写法，记录一下
---

# 如何正确的写一个react页面

## 前言



## 流程

先在<code>screens</code>文件夹下创建一个路由页面<code>kanban.tsx</code>，随便写一点东西：

```react
import React from "react";
import { useDocumentTitle } from "../../utils/index";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");
  return <h1>看板</h1>;
};

```

接着定义一下这个页面所需要的基础类型，在<code>types</code>文件夹下新建一个<code>kanban.ts</code>：

```typescript
export interface Kanban {
    id: number;
    name: string;
    projectId: number;
}
```

接着定义这个页面所需要的接口，在<code>api</code>文件夹下新建一个<code>kanban.ts</code>:

```react
import http, { ResponseData } from "./index";
import { AxiosPromise, AxiosResponse } from "axios";

export const getKanbanInfo = (params?: Partial<Kanban>): Promise<AxiosResponse<Kanban[]>> => {
  return http.request({
    url: `/kanbans`,
    method: "get",
    params,
  });
};


```

接着写这个页面所需要获取数据的逻辑，即<code>hook</code>，在<code>utils</code>文件夹下新建一个<code>kanban.ts</code>：

```react
import { getKanbanInfo } from './../api/kanban';
import { useQuery } from "react-query";
import { Kanban } from "types/Kanban";



export const useKanbans = (param?: Partial<Kanban>) => {
    return useQuery<Kanban[], Error>(["kanbans", param], async () => {
      const res = await getKanbanInfo(param || {}); 
      return res.data;
    });
  };
  
```

这就是一个基本流程。

