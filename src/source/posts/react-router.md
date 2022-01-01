---
title: react-router
date: 2021/5/14
tags: React
categories: Web前端
introduction: react项目中的路由管理，用于和用户增加交互体验，react-router使用的学习记录，react-router版本为v6，包含安装，导入和常见的业务场景
---

## react-router安装

<code>yarn add react-router@6 react-router-dom@6</code>

<code>yarn add history</code>



## 导入

```react
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectScreen } from "screens/project";
```



## 基本使用

### example1

```react
        <Router>
          <Routes>
            <Route
              path={"/projects"}
              element={<ProjectListScreen></ProjectListScreen>}
            ></Route>
            <Route
              path={"/projects/:projectsId/*"}
              element={<ProjectScreen></ProjectScreen>}
            ></Route>
          </Routes>
        </Router>
```

在<code>ProjectListScreen</code>组件中:

```react

import { Link } from "react-router-dom";

   render: (value, project) => (
            <Link to={String(project.id)}>{project.name}</Link>
          )
// 注意，该组件以及在/projects路由下了，此时<Link>to跳转到的路由就是在/projects后面拼接，例如/projects/5
```

### example2

在<code>ProjectScreen</code>组件中:

```react
import React from "react";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router";
import { KanbanScreen } from "screens/kanban";
import { EpicScreen } from "screens/epic";

export const ProjectScreen = () => {
  return (
    <>
      <h1>ProjectScreen</h1>
      // 注意，这里不是/kanban 如果是的话则代表直接跳到localhost/kanban
      // 这里代表跳到 当前组件路由后面 localhost/projects/1/kanban
      <Link to={"kanban"}>看板</Link>
      <Link to={"epic"}>epic</Link>
      <Routes>
        <Route path={"/kanban"} element={<KanbanScreen></KanbanScreen>}></Route>
        <Route path={"/epic"} element={<EpicScreen></EpicScreen>}></Route>
          // 默认路由(上面两个匹配不到的话)
         <Navigate to={window.location.pathname + '/kanban'}></Navigate>
      </Routes>
    </>
  );
};
```

## 重置路由

```react
export const resetRoute = () => (window.location.href = window.location.origin);
```

