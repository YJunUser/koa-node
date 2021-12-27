---
title: react一些可复用的方法
date: 2021/5/31
tags: React
categories: Web前端
introduction: react中有许多可复用的工具方法，这里记录下来，以便在其他项目中直接使用
---



## 记录一下碰到的可复用的方法

### 获取url指定pathnmae后面的参数

形如<code>http://localhost:3000/projects/1/kanban</code>

```react
// 根据url后面的参数去请求， hook获取id
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  //  ["projects/1", "1", index: 1, input: "/projects/1/kanban", groups: undefined] [1]
  return Number(id);
};
// 最后得到1

// 请求数据
export const useProjectInUrl = () => useProjectById(useProjectIdInUrl());

// 获取params
export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

// 获取QueryKe
export const useKanBansQueryKey = () => ["kanbans", useKanbanSearchParams()];
```

