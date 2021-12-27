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

npm install @types/node --save-d
npm install @types/koa @types/koa-router @types/koa-bodyparser --save-d

```

## 配置

<code>package.json</code>

```json
"dev": "cross-env NODE_ENV=dev nodemon -e ts --exec ts-node ./src/app.ts",
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