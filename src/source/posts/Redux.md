---
title: Redux
date: 2021/5/22
tags: React
categories: Web前端
introduction: Redux是一个react中热门的跨组件状态管理库，非常优秀，但使用起来较为麻烦，redux如何与异步结合也是一个需要解决的问题
---

## redux安装

<code>yarn add react-redux @reduxjs/toolkit</code>

<code>yarn add @types/react-redux -D</code>

## redux基本使用

在<code>src</code>目录下新建一个<code>stroe</code>文件夹

<code>store/index.tsx:</code>

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { projectListSlice } from "../screens/project-list/project-list.slice"; // 这是一个切片

export const rootReducer = {
  projectList: projectListSlice.reducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
// 根状态树
export type RootState = ReturnType<typeof store.getState>;

```

将这个提供状态的组件包裹其他<code>app</code>:

```react
import React from "react";
import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import { QueryClient, QueryClientProvider } from "react-query";
// 引入store, Provider
import { Provider } from "react-redux";
import { store } from "../store/index";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}> // 包裹全局
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};
```

创建切片:

```react
import { createSlice } from "@reduxjs/toolkit";
// 导入根store类型
import { RootState } from "../../store/index";

// 一个切片维护一个状态树
interface State {
  projectModalOpen: boolean;
}

// 切片的state
const initialState: State = {
  projectModalOpen: false,
};

export const projectListSlice = createSlice({
  name: "projectListSlice", // 表示slice本身
  initialState, // slice切片状态的默认状态
  // reducer依然是纯洁没有副作用
  reducers: {
    openProjectModal(state) {
      // 为什么可以直接给state赋值，而不是返回一个新对象呢(usereducer)?
      // redux比较机制，a.name = 'dad' a === a true 这里reduxtoolkit借助了immer处理了， 它会创建一个新对象，将行为映射到新对象上，然后再返回
      // 所以我们没有违反纯函数原则
        // 其实这里相当于返回了一个新的state对象
      state.projectModalOpen = true;
    },
    closeProjectModal(state) {
      state.projectModalOpen = false;
    },
  },
});

// 导出actions
export const projectListActions = projectListSlice.actions;

// 导出切片状态，读取的是根状态里的，所以用一个函数
export const selectProjectModelOpen = (state: RootState) => state.projectList.projectModalOpen;

```

使用到组件中：

```react
import { Drawer } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { projectListActions } from "screens/project-list/project-list.slice";
import { selectProjectModelOpen } from "./project-list.slice";

export const ProjectModel = () => {
  const dispatch = useDispatch();
  // useSelect是用来读总的状态树(store)里的状态的
  const projectModalOpen = useSelector(selectProjectModelOpen);
  return (
    <Drawer
      width={"100%"}
      visible={projectModalOpen}
      onClose={() => dispatch(projectListActions.closeProjectModal())}
    >
      <h1>projectModel</h1>
    </Drawer>
  );
};
```

## redux和异步结合

利用redux来管理登录状态：

在<code>store</code>下新建一个<code>auth.slice.ts</code>:

```react
import { UserLogin } from "utils/type";
import { createSlice } from "@reduxjs/toolkit";
import * as auth from "auth-provider";
import { AppDispatch, RootState } from "./index";
import { getMe } from "../api/project-list";

interface AuthForm {
  username: string;
  password: string;
}

interface State {
  user: UserLogin | null;
}

const boostrapUser = async () => {
  let user = null;
  const token = auth.getToken();

  if (token) {
    await getMe(token).then((res) => {
      const data = res.data.user;
      user = data;
    });
  }
  return user;
};

// 初始状态
const initialState: State = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
        // 更新状态
      state.user = action.payload;
    },
  },
});

// 方便使用
const { setUser } = authSlice.actions;

// 重点，在处理异步时的情况，返回一个函数(react-thunk)
// 检测到返回函数的时候，react-thunk就会去执行那个函数
export const login = (form: AuthForm) => (dispatch: AppDispatch) =>
  auth.login(form).then((user) => dispatch(setUser(user)));

export const register = (form: AuthForm) => (dispatch: AppDispatch) =>
  auth.register(form).then((user) => dispatch(setUser(user)));

export const logout = () => (dispatch: AppDispatch) =>
  auth.logout().then(() => dispatch(setUser(null)));

export const boostrap = () => (dispatch: AppDispatch) =>
  boostrapUser().then((user) => dispatch(setUser(user)));

export const selectUser = (state: RootState) => state.auth.user;

```

使用：

```react
export const useAuth = () => {
    // 规定dispatch的类型，这样用then不会报错
  const dispatch: (...args: unknown[]) => Promise<UserLogin> = useDispatch();
    // 取得state里的user
  const user = useSelector(selectUser);
    
  const login = useCallback(
      // d
    (form: AuthForm) => dispatch(authStore.login(form)),
    [dispatch]
  );
  const register = useCallback(
    (form: AuthForm) => dispatch(authStore.register(form)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(authStore.logout()), [dispatch]);
  return {
    user,
    login,
    register,
    logout,
  };
};
```

## react-thunk

![image-20210522194206152](images/artical-image/image-20210522194206152.png)
