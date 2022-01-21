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
# 注意， 所有select查询均不修改数据库内容
# 查看表中数据
Select * from ${tableName};
# 查看表结构
desc ${tableName};

# 模糊查询 like
# %匹配任意个字符 一个下划线只匹配一个字符 可以加转义字符查自己
# 找出名字中含有O的
select ename from EMP where ename like '%O%';
# 找出以T结尾
select ename from EMP where ename like '%T';
# 找出第二个字母是A
select ename from EMP where ename like '_A%';

# 排序 排序总是放在最后
# 默认升序
select ename,sal from emp order by sal;
select ename,sal from emp order by sal asc;
# 降序
select ename,sal from emp order by sal desc;
# 先按sal升序排，sal相同的情况下，按ename的降序排
select ename,sal 
from emp 
order by 
sal asc,ename desc;

# 单行处理函数（一个输入一个输出）also call 数据处理函数
# 转小写
select lower(ename) as ename from emp;
# 转大写
select upper(ename) as ename from emp;
# substr 取子串 注意起始下标从1开始
select substr(ename, 1, 1) as ename from emp;
# concat 字符串拼接
select concat(ename, 'A') from emp;
# length 长度
select length(ename) as lengthEname from emp;
# trim 去空格
select trim(ename) as ename from emp;
# str_to_date 字符串转日期
# date_format 格式化日期
# format 设置千分位
# round 四舍五入
# rand 随机数
select rand() from emp;
# ifnull 只要有null参与的数学运算，最后结果就是null
# ifnull(数据, 被当作哪个值)
select ename, (sal + ifnull(comm, 0)) * 12 as yearSal from emp;
# case...when...then...when...then...else...end
# 当员工是'Manager' 工资上涨百分之10 当员工是'SalesMen' 上涨百分之15
select ename, case job when 'MANAGER' then sal * 1.1 when 'SALESMEN' then sal * 1.5 else sal end as newSal from emp;

# 多行处理函数 as 分组函数（多个输入一个输出）比如一列求和
# 必须先进行分组 然后才能用
# 若没有分组 整张表默认为一组
# 分组函数全都自动忽略null 不需要处理
# 分组函数不能直接使用在 where 语句中 select ename, sal from emp where sal > min(sal);是错的 where语句执行的时候还没有分组，所以不能用分组函数
# count
select count(comm) from emp;
# 统计总共多少行记录
select count(*) from emp;
# avg
# sum
# max
# min
select avg(sal), max(sal), min(sal), count(sal), sum(sal) from emp;

# 分组查询（非常重要）
1. select ...
2. from ...
3. where ...
4. group by ...
5. having...
6. order by ...
以上顺序不能颠倒
实际顺序是 234516
# 按照工作岗位分组，求不同类别工作岗位的总工资
select job, sum(sal) from emp group by job;
# 如果加个ename, 在orcale中会报错 mysql不会 但是也没有意义 是按照job分组的，ename数量是对不上的 select后面只能跟分组字段和分组函数 其余的一律不行
select ename, job, sum(sal) from emp group by job;
# 联合分组，求不同部门里不同岗位的最高薪资
select deptno, job, max(sal) from emp group by deptno, job;
# having语句，对分组后进一步过滤，不能单独使用
select deptno, max(sal) from emp group by deptno having max(sal) > 3000;
上面的效率比较低，可以先用where筛选掉3000以下的，再进行分组，优先选择where，where不行再用having

```

## Note
### 数据库中的字符串都是单引号
### 数据库中null不能使用=进行衡量，需要使用is null
### and优先级比or高