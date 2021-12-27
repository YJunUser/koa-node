---
title: mysql
date: 2021/12/24
tags: mysql
categories: 服务端
introduction: 如果21世纪还有不会sql语言的程序员，那他是不合格的
---

## 常用命令
```shell
# 登陆
mysql -u root -p
# 退出
exit
# 查看数据库 注意每个命令都有分号 默认自带4个
show databases;
# 使用数据库
use ${databaseName};
# 查看当前数据库
select database();
# 创建数据库
create database ${databaseName};
# 删除数据库
drop database ${databaseName};
# 查看某个数据库下的表
show tables;
# 导入sql 
source ~/Downloads/bjpowernode.sql;
#  查看当前版本号
select version();
```

## SQL
```shell
# 查看表中数据
Select * from ${tableName};
# 查看表结构
desc ${tableName};
```

## Note
### 数据库中的字符串都是单引号
### 数据库中null不能使用=进行衡量，需要使用is null
### and优先级比or高