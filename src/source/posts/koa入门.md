---
title: koa入门
date: 2021/12/12
tags: nodejs
categories: 服务端
introduction: koa是nodejs中非常热门的中间件框架之一，其async，await语法和es6非常契合，如何在项目中合理的使用koa，如何配置和部署koa项目，我记录了自己的使用体验
---

# 安装

**创建项目**：

```shell
npm init -y
```

**启用<code>typescript</code>**:

```shell
npm install typescript ts-node --save-d
# 启用tsconfig.json
tsc --init
```

**安装相关依赖**:

```shell
npm install koa --save
npm install cross-env --save
npm install nodemon --save-d
npm install koa-router --save
npm install koa-bodyparser --save
npm install mysql2 --save
npm install joi --save
npm install log4js --save
npm install module-alias --save

npm install @types/node --save-d
npm install @types/koa @types/koa-router @types/koa-bodyparser --save-d
npm install @types/joi --save-d
npm install @types/module-alias --save-d

// 使用module-alias做别名
https://www.jianshu.com/p/d9268465c4b8
// tsconfig.json jsconfig.json是仅限于给vscode这款编辑器做配置的文件，不影响程序执行时的实际情况。
```

## 配置

<code>package.json</code>

```json
"dev": "cross-env NODE_ENV=dev nodemon -e ts --exec ts-node ./src/app.ts",
```

## 查询参数

### query

/classic?a=1

```typescript
ctx.request.query
ctx.query
```

### body

```typescript
// 需要先安装koa-bodyparser
ctx.request.body
```

### header

```
ctx.request.header
ctx.header
```

### path

/classci/:id/dada

```
ctx.params
ctx.request.params
```



## 路由系统的改造

`koa-router` 

### 多路由拆分

现在觉得最方便的还是只用一个`Router`实例，将不同模块的路由可以直接写在一个文件里面，路由的中间件函数通过`controller`文件夹来控制，可以很方便的查看和寻找所需板块的路由，通过控制器再找到特定的处理逻辑

```typescript
import * as Router from 'koa-router';
import user from '../controllers/user';
import articles from '../controllers/articles';
import life from '../controllers/life';
const router = new Router();

// 登陆板块
router.get('/user/login', user.find);

// 文章板块
router.get('/articles', articles.getArticles);
router.get('/articles/:path', articles.getArticleByPath);

// 生活板块
router.get('/life', life.getLife);
router.get('/life/:path', life.getLifeByPath);

export default router;
```

## 异常处理

异常是程序中不可避免的一个环节，在`koa`中，如何保证每一个异常都能正确的捕捉到，并返回给前端正确的信息

### 全局异常处理中间件

当然是写一个全局中间件来捕捉所有异常，监听错误，并返回一段有意义的信息

```typescript
import { Context } from 'koa';

const catchError = async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.body = "服务器出错了，请稍等"
  }
};

export default catchError;
```

现在我们能正确捕捉到异常了，但我们需要对`error`信息进行简化，用清晰明了的信息返回给前端

### 异常基类

为了清晰的表明返回的异常格式，我们可以先自己定义一个异常基类

```typescript
class HttpException extends Error {
  // 错误信息
  msg: string;
  // HTTP状态码
  statusCode: number;
  // 错误状态码 开发者自定义
  errorCode: number;

  constructor(
    msg: string = '',
    statusCode: number = 400,
    errorCode: number = 10000
  ) {
    super();
    this.msg = msg;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}
```

然后我们在代码中可以手动抛出异常

```typescript
import HttpException from './core/http-exception';

const error = new HttpException('格式错误', 400, 10000);
throw error;
```

再在中间件中捕捉它

```typescript
import { Context } from 'koa';
import { HttpException } from '../core/http-exception';
const catchError = async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    // 通过instanceof区分是已知错误还是未知错误
    if (error instanceof HttpException) {
      ctx.body = {
        msg: error.msg,
        errorCode: error.errorCode,
        requestUrl: `${ctx.method} ${ctx.path}`,
      };
      ctx.status = error.statusCode;
    } else {
      ctx.body = {
        msg: '发生了一些未知错误～',
        errorCode: 999,
        requestUrl: `${ctx.method} ${ctx.path}`,
      };
      ctx.status = 500;
    }
  }
};


```

### 特定异常类

当然，这只是我们的异常基类，我们可以根据实际环境派生出我们需要使用的其他类

```typescript
class ParameterException extends HttpException {
  constructor(msg: string = '', errorCode: number = 10000) {
    super();
    this.msg = msg || '参数错误';
    this.errorCode = errorCode;
    this.statusCode = 400;
  }
}
```

这样我们就能根据实际情况抛出我们的异常，并且可以复用

## 参数校验

用于`koa`参数校验的库比较少，并且很多都对`typescript`不支持，最后我结合了`github`上star树比较多的`joi`来使用，参考文档如下[joi文档](https://joi.dev/api/?v=17.6.0)

同样是面向对象的编程方式，先创建一个校验基类

```typescript
import Joi, { Schema } from 'joi';
import { ParameterException } from './http-exception';

class Validator {
  data: any;
  schema: Schema;
  constructor(schema: Schema, data: any) {
    this.data = data;
    this.schema = schema;
  }

  public validate() {
    const { error } = this.schema.validate(this.data);
    if (error) {
      const exception = new ParameterException(error.message, 10003);
      throw exception;
    }
    return;
  }
}

```

传入`data`属性和校验的规则`schema`，再调用`validate`方法就能进行校验，如果校验失败会抛出异常，并被我们之前的异常捕捉中间件给捕捉到



## 自定义返回格式

一般对于返回的数据，都有统一的格式要求，我们可以根据需求自己封装

```typescript
import { Context } from 'vm';

// 在ctx上自己添加两个属性用于返回格式
export const routerResponse = async (
  ctx: Context,
  next: () => Promise<any>
) => {
  Object.defineProperty(ctx, 'success', {
    writable: true,
    value: (data?: any, des: string = '') => {
      ctx.body = {
        msg: 'success',
        errorCode: 0,
        description: des,
        data: data,
      };
      ctx.status = 200;
    },
  });

  Object.defineProperty(ctx, 'fail', {
    writable: true,
    value: (data?: any, des: string = '') => {
      ctx.body = {
        msg: 'fail',
        errorCode: 10000,
        description: des,
        data: data,
      };
      ctx.status = 500;
    },
  });

  await next();
};
```

## 密码加密

一般密码是不能明文形式存储的，需要用到brcypt库来进行加密解密

```typescript
// 密码加密，密码不能以明文形式存储到数据库中
// 10代表计算机round次数，越大越安全，耗时也越长
    const salt = bcrypt.genSaltSync(10);
    const psw = bcrypt.hashSync(param.password, salt);
```

## 接口加密与权限控制

对于后端接口，是需要进行加密的，不然任何人都可以直接请求接口数据，所以我们采用了jwt对于前后端的通信进行限制

```typescript
// 引入jsonwebtoken的包，定义一些基本配置项
const jwtConfig = {
  secretKey: 'abcd',
  expiresIn: 60 * 60 * 24 * 30,
};

export default jwtConfig;

```



```typescript
import jwtConfig from '../config/jwt';
import jwt from 'jsonwebtoken';

// utils 获取token， 其中往token中存储的数据是自己定义的
const generateToken = (uid: string, scope: number) => {
  const { secretKey, expiresIn } = jwtConfig;
  const token = jwt.sign(
    {
      uid,
      // scope进行权限分级
      scope,
    },
    secretKey,
    {
      expiresIn,
    }
  );
  return token;
};

export { generateToken };
```



权限控制可以用scope变量来进行控制，比如一个接口限制只有管理员才能访问，普通用户不能访问，那么我们可以设置scope来进行控制

```typescript
// 设置权限层级
export enum AuthLevel {
  USER = 8,
  ADMIN = 16,
  SUPERADMIN = 32,
}

```



```typescript
import { Context } from 'koa';
import { ForBiddenException } from '../core/http-exception';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import jwtConfig from '../config/jwt';

class Auth {
  level: number;
  // 传入level
  constructor(level: number) {
    this.level = level;
  }

  get m() {
    return async (ctx: Context, next: () => Promise<any>) => {
      const bearToken = ctx.header.authorization?.split(' ')[1];
      if (!bearToken) {
        throw new ForBiddenException('token不合法');
      }
      try {
        const decode: any = await jwt.verify(bearToken, jwtConfig.secretKey);
				// 比较权限大小
        if (decode.scope > this.level) {
          throw new ForBiddenException('权限不足');
        }
        ctx.auth = {
          uid: decode.uid,
          scope: decode.scope,
        };
      } catch (error) {
        switch ((error as VerifyErrors).name) {
          case 'TokenExpiredError':
            throw new ForBiddenException('token已过期');
          case 'JsonWebTokenError':
            throw new ForBiddenException('token不合法');
          case 'NotBeforeError':
            throw new ForBiddenException('token未生效');
        }
      }

      await next();
    };
  }
}

export default Auth;
```



```typescript
// 对于需要加密的接口，用auth中间件加密, 并传入level进行权限控制
router.get('/users', new Auth(AuthLevel.USER).m, UserController.getUser);
```

## 微信登陆

```
const wxConfig = {
  appId: 'wx6e5c201ced114b2a',
  appSecret: '336f114bb585f657a82a0ed715519015',
};

```



## 部署

```shell
# 先将ts编译成js，再用pm2去跑
# tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs", // 编译生成的模块系统代码
    "target": "es2015", // 指定ecmascript的目标版本
    "noImplicitAny": true, // 禁止隐式any类型
    "outDir": "./dist",
    "sourceMap": false,
    "allowJs": false, // 是否允许出现js
    "newLine": "LF"
  },
  "include": ["./src/**/*"],
  "files": ["./src/app.ts"]
}

# package.json
"compile": "tsc"

# bootstrap.sh
set -e

nvm use 16
npm run compile

pm2 start ./dist/app.js
```

appkey:1XeXRW3kJF2sUjSY



select  name from student group by name;

