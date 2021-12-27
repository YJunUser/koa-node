---
title: 用react-query来获取、更新、缓存远程数据
date: 2021/5/24
tags: React
introduction: react-query使用初体验，是一个很好的库，从前端状态管理来看，react-query清晰又简单，这里分享下我的一些基础用法
---

## react-query

先上个链接[react-query官方文档](https://react-query.tanstack.com/)

这是一个适用于`react hooks`的请求库。 这个库将帮助你获取、同步、更新和缓存你的远程数据， 提供两个简单的 hooks，就能完成增删改查等操作

## 安装

<code>yarn add react-query</code>

## 配置

## 一些配置参数

- `staleTime` 重新获取数据的时间间隔 默认`0`
- `cacheTime` 数据缓存时间 默认 1000 * 60 * 5 5分钟
- `retry` 失败重试次数 默认 3次
- `refetchOnWindowFocus` 窗口重新获得焦点时重新获取数据 默认 false
- `refetchOnReconnect` 网络重新链接
- `refetchOnMount` 实例重新挂载
- `enabled` 如果为“false”的化，“useQuery”不会触发，需要使用其返回的“refetch”来触发操作

如何全局配置呢？如下：

```react
import { ReactQueryConfigProvider, ReactQueryProviderConfig } from 'react-query';

const queryConfig: ReactQueryProviderConfig = {
  /**
   * refetchOnWindowFocus 窗口获得焦点时重新获取数据
   * staleTime 过多久重新获取服务端数据
   * cacheTime 数据缓存时间 默认是 5 * 60 * 1000 5分钟
   */
  queries: { 
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, 
    retry: 0
  },
};

ReactDOM.render(
    <ReactQueryConfigProvider config={queryConfig}>
        <App />
    </ReactQueryConfigProvider>
    document.getElementById('root')
  );
```

也可以单独配置，如下：

```react
function Todos() {
   // 第三个参数即可传参了
   // "enabled"参数为false的化，不会自动发起请求，而是需要调用“refetch”来触发
   const {
     isIdle,
     isLoading,
     isError,
     data,
     error,
     refetch,
     isFetching,
   } = useQuery('todos', fetchTodoList, {
     enabled: false,
   })

   return (
     <>
       <button onClick={() => refetch()}>Fetch Todos</button>

       {isIdle ? (
         'Not ready...'
       ) : isLoading ? (
         <span>Loading...</span>
       ) : isError ? (
         <span>Error: {error.message}</span>
       ) : (
         <>
           <ul>
             {data.map(todo => (
               <li key={todo.id}>{todo.title}</li>
             ))}
           </ul>
           <div>{isFetching ? 'Fetching...' : null}</div>
         </>
       )}
     </>
   )
 }
```

## 使用

### useQuery(查)

[useQuery详细介绍](https://react-query.tanstack.com/reference/useQuery)

<code>useQuery</code>通常包含两个参数：

- 一个能唯一标识这个请求的 `Query key`
- 一个真正执行请求并返回数据的异步方法

ReactQuery 的缓存策略是基于这个 key 来实现的。key 值除了字符串外，还可以是一个数组或者对象，当key改变时，就会**重新执行**<code>useQuery</code>

```react
export const useProject = (param?: Partial<Project>) => {
  // key变化的时候useQuery就会重新触发, 所以这里加上param
  return useQuery<Project[], Error>(["projects", param], async () => {
    
    const res = await getProject(param || {}); // 如果不用await 返回的是AxiosPromise<Project []> 即 Promise<AxiosResponse<Project[]>>, 用了后， 就成了 AxiosResponse<Project[]>
    return res.data;
  });
};

export const useProjectById = (id?: number) => {
  return useQuery<Project>(
    ["project", { id }],
    async () => {
      const res = await getProjectById(id);
      return res.data;
    },
      // 第三个参数，config
    {
      // 当id为undefined的时候，就不去查询了
      enabled: !!id,
    }
  );
};

```

>  如果2s内（可设置）有相同的queryKey发出了请求，那么react-query会将其合并，并只发送一次，所以我们可以放心大胆的在不同的组件中或是在相同的组件中多次使用hook请求数据

常用的返回值：

```react
   const { isLoading, isError, data, error } = useProject(param)

   if (isLoading) {
     return <span>Loading...</span>
   }

   if (isError) {
     return <span>Error: {error.message}</span>
   }

   // also status === 'success', but "else" logic works, too
   return (
     <ul>
       {data.map(todo => (
         <li key={todo.id}>{todo.title}</li>
       ))}
     </ul>
   )
 }
```

### useMutation(增、删、改)

[useMutaion详细介绍](https://react-query.tanstack.com/reference/useMutation)

```react
export const useEditProject = () => {
    // 获得query实例
  const queryClient = useQueryClient();
  return useMutation(
      // 第一个参数仍然是一个返回Promise<data>的函数
    async (params: Partial<Project>) => {
      const res = await editProject(params);
      return res.data;
    },
      // 第二个参数是config
    {
        // 成功后，就清除掉缓存中的projects，就会去重新执行所有地方的useQuery，
        // 实现列表的刷新
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );
};

// 异步mutate 需要用mutateAsync().then()时
const { mutateAsync, error, isLoading: mutateLoading } = useMutateProject();
```

返回值：

```react
const { mutate } = useEditProject();
// mutate即更新函数
... 
     onCheckedChange={async (pin) => {
         // 更新操作
           await mutate({ id: project.id, pin });
      }}
...
```



## 什么时候用react-query

看起来<code>react-query</code>也是一种状态管理工具，那和<code>redux</code>有异曲同工之妙

首先，我们需要知道什么是服务端状态。在无意识的行为中，我们通常都将所有的组件渲染所需要的数据都放在一起管理，比如放在 State 中或者通过 Redux 这类状态管理库来管理。

然而，我们再来斟酌一下我们的数据，是不是通常都有明显的来源特征：

列表数据、详情数据等通过调接口由**服务端提供的数据**；
选中状态、折叠状态这类由**客户端来维护的状态**；
基于数据的来源，我们就可以将组件渲染所需要的状态分为**服务端状态**和**客户端状态**。

所以，我的理解是，客户端状态就交给<code>redux</code>这类库来管理，而服务端状态就交给<code>react-query</code>来管理更方便，因为它包含许多和请求数据有关的api

### ReactQuery 的状态管理

ReactQuery 就将我们所有的服务端状态维护在全局，并配合它的**缓存策略**来执行数据的存储和更新。借助于这样的特性，我们就可以将所有跟服务端进行交互的数据从类似于 Redux 这样的状态管理工具中剥离，而全部交给 ReactQuery 来管理。

ReactQuery 会在全局维护一个服务端状态树，根据 **Query key **去查找状态树中是否有可用的数据，**如果有则直接返回，否则则会发起请求**，**并将请求结果以 Query key 为主键存储到状态树中**。当我们用<code>mutaion</code>改变缓存后的key后，<code>react-query</code>会监听到每一个用到这个<code>querykey</code>的地方，并重新执行<code>useQuery</code>，重新渲染用到的那个组件，注意子组件也会重新渲染。

### 缓存

ReactQuery 的缓存策略使用了 stale-while-revalidate. 在 MDN 的 Cache Control 中对这个缓存策略的解释是：

客户端愿意接受陈旧的响应，同时在后台异步检查新的响应
在 ReactQuery 中的体现是，可以接受状态树中存储的 stale 状态数据, 并且会在缓存失效、新的查询实例被构建或 refetch 等行为后执行更新状态。

> Tips： 记得在登出等场景清空所有缓存
>
>  const logout = () => {
>
>   return auth.logout().then((user) => {
>
>    setUser(null);
>
>    **queryClient.clear();**
>
>   });
>
>  };

