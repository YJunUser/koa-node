---
title: TypeScript进阶之utility types
date: 2021/5/7
tags: TypeScript
categories: Web前端
introduction: 列举了一些项目中常用的typescript工具
---

# TypeScript utility types

## 1、Partial
构造一个所有属性都Type设置为optional的类型。该实用程序将返回一个表示给定类型的所有子集的类型，所以所有属性都会加上一个undefined

### example:

```typescript
export interface User {
    id: string;
    name: string;
    token: string;
}

let part: Partial<User> = {id: '1'}
let part: Partial<User> = {id: undefined}
```

## 2、Required
构造一个类型，该类型由Typeset的所有属性设置为required

### example: 

```typescript
export interface User {
    id: string;
    name: string;
    token: string;
}

let part: Required<User> = {id: '1'}
```

![image-20210507203315789](/images/artical-image/image-20210507203315789.png)

## 3、Readonly
构造一个所有属性都Type设置为的类型readonly，这意味着无法重新分配所构造类型的属性。

## # example:

```typescript
export interface User {
    id: string;
    name: string;
    token: string;
}

let part: Readonly<User> = {id: '1', name: 'xiaoming', token: 'abc'}
part.name = 'xiaoli'
```

![image-20210507203606006](/images/artical-image/image-20210507203606006.png)

## 4、Record<Keys,Type>
构造一个对象类型，其属性键为Keys，属性值为Type。该实用程序可用于**将一个类型的属性映射到另一个类型。**

### example: 

```typescript
export interface User {
    id: string;
    name: string;
    token: string;
}

let part: Record<'keys', User> = {keys: {id: '1', name: 'xiaoli', token: 'a'}}
```

## 5、Pick<Type, Keys>
通过Keys从中选择一组属性（字符串文字或字符串文字并集）来构造类型Type。

### example:

```typescript
export interface User {
    id: string;
    name: string;
    token: string;
}

let part: Pick<User, 'id' & 'token'> = {id: '1', token: 'abc'}
```

## 6、Omit<Type, Keys>
通过从中选择所有属性Type然后删除Keys（字符串文字或字符串文字的并集）来构造类型。

### example:

```typescript
export interface User {
    id: string;
    name: string;
    token: string;
}

let part: Omit<User, 'id'> = {name: 'xiaoming', token: 'abc'}
```



## 7、Parameters
从函数类型的参数中使用的类型构造一个**元组类型Type。**

### example:

```typescript
const fn = (str: string, num: number) => {};
let params: Parameters<typeof fn> = ["str", 1];
```



## 8、ReturnType
构造一个由函数的返回类型组成的**类型Type。**

### example:

```typescript
const fn = (str: string, num: number) => {
  return { str, num };
};
let params: ReturnType<typeof fn> = {str: 'a', num: 1}
```



## 9.类型守卫

我们知道，<code>unknown</code>类型是不能直接访问属性的。

### example:

```typescript
function ErrorBox({error}: {error: unknown}) => {
	if(error.message) { // 这里会报错， 因为不能访问unknown上的属性
		return error
	}
}
```

这时候就可以用类型守卫来解决这个问题：

```typescript
const isError = (value: any): value is Err => value?.message

function ErrorBox({error}: {error: unknown}) => {
	if(isError(error)) { // 这里会报错， 因为不能访问unknown上的属性
		return error
	}
}
```

