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

# in not in
select ename from emp where ename in ('MANAGER', 'SALESMAN');
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
# 把varchar类型转换为date类型 通常用于insert
str_to_date('1999-01-23', '%Y-%m-%d');
# date_format 格式化日期 通常用于查询
# select展示的都是字符串，查询时数据库默认也会将date类型转为varchar，date_format可以指定转化的格式
select id, name, date_format(birth, '%m/%d/%Y') as birth from t_user;
# format 设置千分位
select ename, format(sal, '$999,999') from emp;
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

# 把查询结果去重 disctinct只能出现在所有字段的最前方
select distinct job from emp;
select count(distinct(job)) from emp;

# 连接查询
# 如果两张表连接没有任何限制： 笛卡尔积 14行 * 4行
select ename, dname from emp, dept;
select ename, dname from emp, dept where emp.deptno = dept.deptno;
# 提高效率 起别名
select e.ename, d.dname from emp e, dept d where e.deptno = d.deptno;

# 内连接显示所有匹配到的数据
# 内连接-等值连接
SQL92: # 基本不用
select e.ename, d.dname
from emp e, dept d
where e.deptno = d.deptno;
# 不占用where inner可省略
SQL99:
select e.ename, d.dname
from emp e
inner join
dept d
on e.deptno = d.deptno
where ...
# 内连接-非等值连接
select e.ename, s.grade
from emp e inner join salgrade s
on
e.sal between s.losal and s.hisal;
# 内连接-自连接
select a.ename as '员工', b.ename as '领导'
from emp a inner join emp b
on
a.mgr = b.empno;

# 外连接 匹配不上的也查出来 查询结果条数一定大于内连接
# 任何一个左连接都有右连接的写法，反之同理
# 右外连接 把join右边的表没匹配上的也查出来，即右边为主表，所有数据都要查出来
select e.ename, d.dname
from emp e right join dept d
on e.deptno = d.deptno;
# 显示所有员工名字和其领导名
select a.ename, b.ename
from emp a left join emp b
on a.mgt = b.empno;

# 多表连接
select ...
from 
a
join
b
on
...
join
c
on
...
right join d
on
...

select e.ename, e.sal, d.dname, s.grade
from
emp e left join dept d
on e.deptno = d.deptno
join salgrade s
on e.sal between s.losal and s.hisal;

# 子查询 select语句中嵌套select语句 先执行子查询
select 
  ..(select)
from
  ..(select)
where
  ..(select)
# 找出比最低工资高的员工姓名和工资 where中的子查询
select e.sal from emp e where e.sal > (select min(sal) from emp);
# 找出每个岗位平均工资的等级 from中的子查询，查询结果可当一张临时表
select t.*, s.grade
from (select job, avg(sal) as avgSal from emp group by job) t
inner join salgrade s
on t.avgSal between s.losal and s.hisal;

# union 合并查询结果集 union把乘法变成了加法 减少了匹配次数
# 要求列数和列的数据类型必须一致
select ename, job from emp where job = 'MANAGER'
union
select ename, job from emp where job = 'SALESMAN';

# limit 将查询结果一部分取出来， 通常用于分页
# limit 在orderby之后执行
# 完整用法 limit startIndex, length
select ename, sal from emp order by sal desc limit 0, 5;
# 缺省用法 取前5
select ename, sal from emp order by sal desc limit 5;
# 分页
select ... from ... limit ${(pageNo - 1) * pageSize}, ${pageSize}

# DQL
select
...
from
...
where
...
group by
...
having
...
order by
...
limit
...


# 建表
create table 表名(
	字段名1 数据类型,
	字段名2 数据类型
);
表名建议以t_或tbl_开始

create table t_student(
	no int(3),
	name varchar(32),
	sex char(1) default 'm', 默认值
	age int(3),
	email varchar(255)
);
# 将查询结果当一张表新建
create table emp2 as select * from emp;

# 数据类型
varchar 可变长度字符串 varchar(10) 最多10个 动态分配空间 最长255
char 定长 不管数据长度 分配固定长度空间去存储 最长255
int 最长11 int(3) 建议长度为3
bigint
float
double
date 短日期 str_to_date转化varchar到date 只包括年月日 %Y-%m-%d
datetime 长日期 年月日时分秒 %Y-%m-%d %h:%i:%s
# now() 获取系统当前时间 datetime类型
clob 字符大对象 最多可以存储4g字符串 超过255就用这个
blob 二进制大对象 图片 声音 视频等流媒体数据

# 删表
drop table t_student if exists;

# 插入数据 insert 成功必然会多一条记录 默认值为null 可插入多条
insert into 表名(字段名1, 字段名2) values(值1, 值2)
insert into t_student(no, name, sex, age, email) values(3, 'zhangsan', 'm', 23, '1231231@131.com');
# 将查询结果插入一张表 基本不用
insert into t_student select * from t_student;
# 更新数据 update
update t_student set name = 'yaobojun', age = 24 where no = 3; 
# 删除 delete 只删除数据 没有释放内存 可回滚
delete from t_student where no = 3;
delete from t_student; # 删除所有
# truncante 物理删除 无法回滚 快
truncate table t_student;

# 对表结构进行修改 alter

# 约束
非空约束 (not null)
唯一约束 (unique) 可以为null
主键约束 (primary key PK)
外键约束 (foreign key FK)
检查约束 (mysql不支持 orcale支持)

create table t_vip(
	id int not null,
	name varchar(255) unique,
	email varchar(255),
	tel varchar(255),
	unique(email, tel) # 两个字段联合起来唯一
	xx int not null unique, # 就等于主键 PK
	# 在mysql中 如果一个字段被not null和unique 自动成为主键
	primary key(id, name) # 复合主键
	# 一张表 主键约束只能有一个 主键值一般是定长数字 建议
	# 不建议主键和业务挂钩 主键保证唯一性就行
	xx primary key auto_increment, # 从1开始以1自增 
)

create table t_class(
	classno int primary key,
	classname varchar(255)
);

create table t_student(
	no int primary key auto_increment,
	name varchar(255),
	cno int,
	# 外键约束 保证这个数据其他表里是存在的 被引用的不一定是其他表的主键 但至少是有unique约束的 外键值可以为null 外键值不一定是unique的
	foreign key (cno) references t_class(classno)
);

# 事务 非常重要 transaction
一个事物就是一个完整的业务逻辑
DML：insert update delete
只有以上三个语句和事务有关，其余没有
正是因为做某件事的时候需要多条DML语句联合完成，所以需要事务存在
本质上 一个事务就是多条DML语句同时成功或者同时失败

在事务执行过程中，每一条DML语句都会记录到“事务性活动的日志文件”
在事务执行过程中，我们可以提交事务，也可以回滚事务
# 提交事务 commit
清空日志文件，并把数据持久化到数据库中，标志着全部成功
# 回滚事务 rollback 回滚到上一次的提交点
将之前的DML语句全部撤销，并清空日志文件，标志着全部失败
# mysql默认情况下是自动提交事务的，每执行一次DML语句，自动提交一次
# 关闭自动提交 start transaction;
start transaction;
# 开启事务后，会关闭自动提交，此时执行DML语句后commit才会真正将数据写入，rollback会将DML语句撤销

# 事务的隔离性
A事务在操作一张表的时候，另一个事务B也在操作这张表会怎样
# 查看隔离级别
select @@transaction_isolation;
# 设置隔离级别
set global transaction isolation level read committed;
# 事务与事务之间的隔离级别
# 事务A可以读取到事务B未提交的数据 容易脏读 大多数数据库隔离级别为二档起步
读未提交：read uncommitted (最低)
# 事务A只能读取到事务B提交后的数据 解决脏读 存在不可重复读
读已提交：read committed
# 事务A开启后，不管多久，读到的数据都是一致的，即使B事务修改了数据，事务A读到的数据也不会改变 解决不可重复读 存在幻影现象 即读到假数据 读取到的永远都是开启事务时的数据
可重复读：repeatable read(mysql默认)
# 最高隔离级别，效率最低 事务排队 不能并发 两个事务在操作同一张表时，后面操作的事务会“卡住”排队，直到前面那个事务commit或rollback后
序列化：serializable （最高）

# 索引 面试问的多
索引是在表的字段上添加的，是为了提高查询效率存在的一种机制
# 任何数据库主键都会自动添加索引
# mysql查询两种方式
# 第一种：全表扫描
select job from emp e where e.name = 'Jack'
# 第二种：索引检索
# 添加索引
create index emp emp_ename_index on emp(ename);
# 删除
drop index emp emp_ename_index on emp;
# 怎么看是否使用了索引检索 type=ref 为索引
explain select * from emp where enmae = 'jack';
。。。待续

# 视图 主要作用是简化sql语句
create view emp_view1 as select * from emp;
# 可以对视图对象进行增删改查，注意 原表会改变
insert into emp_view1(id, name) values(2,'ada');
# 应用
# 创建视图
create view emp_dept as
select e.ename, e.sal, d.dname
from emp e
inner join
dept d
on
e.deptno = d.deptno;
# 查询视图
select * from emp_dept;
# 面向视图更新 原表也会该笔
update emp_dept set sal = 1000 where dname = 'account';

# dba常用命令
CREATE USER username IDENTIFIED BY 'password';
# 数据导入导出
....

# 数据库设计三范式
第一范式：必须要有主键、并且每一个字段不可再分
第二范式：第一范式基础上，所有非主键字段全部依赖主键，不要产生部分依赖（多对多场景，复合主键的情况）
第三范式：第二范式基础上，所有非主键字段全部依赖主键，不要产生传递依赖

# 多对多 三张表 关系表两个外键
# 一对多 两张表 多的那张表有外键
# 一对一 实际开发中 字段太庞大 拆分表出现一对一的情况 一对一 两张表 一张表加外键并使外键唯一unique
```

## Note
### 数据库中的字符串都是单引号
### 数据库中null不能使用=进行衡量，需要使用is null
### and优先级比or高



select t.tag_id, count(t.tag_id) from (select f.user_id, f.item_id, a.tag_id from t_fact_action f INNER JOIN t_action a on f.action_id = a.id) t GROUP BY t.tag_id;