---
title: linux命令记录
date: 2021/12/15
tags: nodejs
categories: 运维
introduction: linux命令是程序员的必修课，以前只知道用，现在把自己用到的都写一下记录
---

# linux常用命令

```shell
# 安装 ubuntu
apt-get install git
apt-get install cmake
apt-get install nginx
# nodejs https://github.com/nodesource/distributions
# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt-get install -y nodejs

# pm2
npm i pm2 -g
```



```shell
# 查看nginx进程
ps -ef | grep nginx
# 查看端口和pid
netstat -tupln
# 查看3000端口
netstat -tupln | grep 3000
# 正常杀死进程
kill -15 {pid}
# 强制杀死进程
kill -9 {pid}
# 切换身份
su yaobojun
su默认切换到root
# 列出所有nodejs进程
pm2 list
# 启动 指定ts-node命令 最好编译成js后再启动
pm2 start --interpreter ./node_modules/.bin/ts-node src/app.ts
# 停止进程
pm2 stop {id}
pm2 stop all
# 杀死进程
pm2 delete {id}
pm2 delete all
# 清除日志
pm2 flush
# 传输文件
scp ~/Hacking/koa-node yaobojun@101.35.46.26:/home/yaobojun/
# 清除文件内容
cat /dev/null > a.txt
```



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

