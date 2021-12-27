---
title: TypeScript进阶之封装axios
date: 2021/5/9
tags: TypeScript
categories: Web前端
introduction: Typescript进阶，用typescript封装一个axios试试
---

# TypeScript对axios的封装

项目中用到了<code>typescript</code>和<code>axios</code>，对<code>axios</code>进行封装:

<code>request.js</code>：

```typescript
// 引入axios模块 用{}引入的表示类型
import axios, {
  AxiosInstance, // axios实例
  AxiosRequestConfig, //axios请求config
  AxiosPromise, // axios返回的类型
  AxiosResponse, // axios返回的数据
} from "axios";
const apiBaseUrl = process.env.REACT_APP_API_URL;
```

根据服务端返回的数据格式对返回数据进行约束:

```typescript
export interface ResponseData<T = any> {
    data?: T,
    code?: number,
    msg?: string
}
```

创建<code>HttpRequest</code>类:

```typescript
class HttpRequest {
  constructor(
    public baseUrl: string | undefined = apiBaseUrl,
    public timeout: number = 5000
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  public request(options: AxiosRequestConfig): AxiosPromise {
    const instance: AxiosInstance = axios.create(); // 创建实例
    options = this.mergeConfig(options); // 合并基础路径和每个接口单独传入的配置，比如url、参数等
    this.interceptors(instance, options.url); // 调用interceptors方法使拦截器生效
    return instance(options);
  }

  private interceptors(instance: AxiosInstance, url?: string) {
    // 在这里添加请求和响应拦截
    instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 接口请求的所有配置，都在这个config对象中，他的类型是AxiosRequestConfig，你可以看到他有哪些字段
        // 如果你要修改接口请求配置，需要修改 axios.defaults 上的字段值
        let token = auth.getToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      async (res: AxiosResponse) => {
        console.log(res);

        const { data } = res; // res的类型是AxiosResponse<any>，包含六个字段，其中data是服务端返回的数据
        const { code, msg } = data; // 通常服务端会将响应状态码、提示信息、数据等放到返回的数据中
        if (code === 401) {
          await auth.logout();
          window.location.reload();
          return Promise.reject({ message: "请重新登录" });
        } else {
          return res;
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  private mergeConfig(options: AxiosRequestConfig): AxiosRequestConfig {
    // 这个方法用于合并基础路径配置和接口单独配置
    return { ...options, baseURL: this.baseUrl, timeout: this.timeout };
  }
}

export default HttpRequest;
```

在<code>api</code>目录下新建一个<code>index.ts</code>文件:

<code>index.ts</code>:

```typescript
import HttpRequest from 'utils/request'; // 引入HttpRequest类
export * from 'utils/request' // 导出request文件中的内容
export default new HttpRequest() // 导出HttpRequest实例
```

然后就能在<code>api</code>目录中写请求接口了，例如<code>auth.ts</code>:

```typescript
import http, { ResponseData } from "./index";
import { User } from 'utils/type';
import { AxiosPromise } from 'axios'

// 请求携带参数
interface LoginInformation {
  username: string;
  password: string | number;
}

// 返回数据
interface Response extends User {
    
}

export const userLogin = (
  data: LoginInformation // 这是请求数据
): AxiosPromise<ResponseData<Response>>// 这是返回数据
    => {
  return http.request({
    url: `/login`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
};

export const userRegister = (
  data: LoginInformation
): AxiosPromise<ResponseData> => {
  return http.request({
    url: `/register`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
};

```

调用<code>api</code>:

```typescript
export const login = (data: { username: string; password: string | number}) => {
  return userLogin(data)
    .then((res) => {
      const data = res.data.user;
      return handleUserResponse(data);
    })
    .catch((error) => Promise.reject(error));
};
```

这样就能用<code>typescript</code>对请求的数据和返回的数据进行约束，同时对axios也进行了一次封装。

