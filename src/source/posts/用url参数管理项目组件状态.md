---
title: 用url参数管理项目模态框状态
date: 2021/5/23
tags: React
introduction: 需求中经常遇到url和项目状态绑定的情况，比如根据url直接进入特点的页面，或者根据url填入特定的input参数
---

## useUrlQueryParam

先是封装的一个<code>hook</code>，用于将<code>url</code>中携带的参数给取出来并变成对象：

```react
import { useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { cleanObject } from "./index";

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParam, setSearchParam] = useSearchParams();
  return [
    useMemo(
      () =>
        keys.reduce((prev, cur) => {
          return { ...prev, [cur]: searchParam.get(cur) || "" };
        }, {} as { [key in K]: string }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParam]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      const o = cleanObject({
        ...Object.fromEntries(searchParam),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParam(o);
    },
    // reduce 返回的类型是根据初始值类型来的
  ] as const;
};
```

使用：

```react
export const useProjectsSearchParam = () => {
    // 传过去一个name和personId数组
    // 返回一个诸如{name: 'yaobo', personId: '1'}的param对象
    // 记住返回的都是字符串，要自己处理
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  // 返回引用的时候一定要记得useMemo
  const memorized = useMemo(
    () => ({
      // 返回对象记得加括号
      ...param,
      personId: Number(param.personId) || undefined,
    }),
    [param]
  );
    // 返回元组的时候，用 as const
  return [memorized, setParam] as const;
};
```

## 使用自定义hook来管理组件状态

管理组件状态的方式有很多很多，但是如何把组件的状态和url联系起来呢？

使用：

```react
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => setProjectCreate({ projectCreate: undefined });

  return {
    projectModalOpen: projectCreate === "true",
    open,
    close,
  };
};

```

组件中：

```react
import { Drawer } from "antd";
import React from "react";
import { useProjectModal } from "./util";

export const ProjectModel = () => {
  const { projectModalOpen, close } = useProjectModal();
  return (
    <Drawer width={"100%"} visible={projectModalOpen} onClose={close}>
      <h1>projectModel</h1>
    </Drawer>
  );
};
```

并且多个组件可以同时共享这个状态，因为这个状态是从<code>url</code>中读取的，所以所有组件都能读取并修改，相当于一个全局的状态管理。

例如：

```react
export const ProjectPopover = () => {
  const { open } = useProjectModal();
  .....
      <ButtonNoPadding type={"link"} onClick={open}>
        创建项目
      </ButtonNoPadding>
  ....
  }
```

这样，当我们打开模态框时：

![image-20210523180020172](images/artical-image/image-20210523180020172.png)

关闭后：

![image-20210523180034456](images/artical-image/image-20210523180034456.png)

赋值<code>url</code>也能直接进入到打开模态框的页面

done