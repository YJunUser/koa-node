---
title: react-query实现乐观更新
date: 2021/5/26
tags: React
introduction: react-query是我最近使用的一个react状态管理库，乐观更新是一种常见的需求场景，react-query可以很轻易的实现它
---

## 什么是乐观更新

In an optimistic update the UI behaves as though a change was successfully completed before receiving confirmation from the server that it actually was - it is being optimistic that it will eventually get the confirmation rather than an error. This allows for a more responsive user experience.

## react-query实现乐观更新

```react
export const useEditProject = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useProjectsSearchParam();
    // queryKey,缓存中的key
  const queryKey = ["projects", searchParams];
  return useMutation(
    // variables is an object that mutate will pass to your mutationFn， mutate其实就是把参数传给这个函数，然后触发它
    async (params: Partial<Project>) => {
      const res = await editProject(params);
      return res.data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(queryKey),
      // This function will fire before the mutation function is fired and is passed the same variables the mutation function would receive
      // 在mutate完成前触发，接受和mutate一样的参数
      // 实现乐观更新，在异步请求完成之前，先将改变发生，若发生了错误再回滚
      async onMutate(target: Partial<Project>) {
        const previousItems = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (old?: Project[]) => {
          const newV =
            old?.map((project) =>
              project.id === target.id ? { ...project, ...target } : project
            ) || [];
          return newV;
        });
        return { previousItems };
      },
      // This function will fire if the mutation encounters an error and will be passed the error.
      // If a promise is returned, it will be awaited and resolved before proceeding
      onError(error: Error, newItems: Partial<Project>, context: any) {
        // 回滚
        queryClient.setQueryData(["projects", param], context.previousItems);
      },
    }
  );
};
```

## 封装一个乐观更新hook

先封装一个通用的<code>config</code>，返回乐观更新所需要的<code>option</code>

```react
import { QueryKey, useQueryClient } from "react-query";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return { previousItems };
    },
    onError(error: Error, newItems: any, context: any) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};
```

然后就可以再封装一些具体的乐观更新操作：

```react
export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    return old?.filter((item) => item.id !== target.id) || [];
  });

export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    return old ? [...old, ...target] : [];
  });

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    return (
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
    );
  });
```

然后就可以这样使用：

```react
export const useEditProject = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useProjectsSearchParam();
  const queryKey = ["projects", searchParams];
  return useMutation(
    async (params: Partial<Project>) => {
      const res = await editProject(params);
      return res.data;
    },
     // 乐观更新hook
    useEditConfig(queryKey)
  );
};
```

done