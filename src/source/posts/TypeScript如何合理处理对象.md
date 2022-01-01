---
title: TypeScript如何合理处理对象
date: 2021/5/10
tags: TypeScript
categories: Web前端
introduction: Typescript处理object类型时会遇到许多奇奇怪怪的错误，如何处理，错误是啥请看本篇文章
---

## TypeScript中的object出现的错误

<code>object</code>是个很基础也很常见的引用类型，比如我用<code>typescript</code>定义一个<code>object</code>类型的变量

```typescript
let a: object;
```

乍一看没什么问题，但却_暗藏玄机_

比如我现在想定义一个函数，它能判断对象哪些属性是<code>number</code>类型，然后返回一个由这些属性组成的新的对象:

```typescript
const isNumber = (object: object) => {
    // 在一个函数里，改变传入的对象本身是不好的
    const result = { ...object }
    Object.keys(result).forEach(key => {
        const value = result[key];
        if(typeof value !== 'number') {
            delete result[key];
        }
    })
    return result;
}
```

这样看上去没什么问题，但是编译器会报错：

![image-20210510173337280](images/artical-image/image-20210510173337280.png)

上面提示不能用<code>key</code>作为<code>{}</code>类型的索引，但result为什么是<code>{}</code>类型呢？它为什么是个空对象呢?

这就是<code>object</code>类型的弊端，它覆盖的范围太广，几乎除了原始类型外的所有类型都是由它而衍生的，原型链的终点都有它

看下面一段代码就明白了：

```typescript
let a: object;
a = {name: 'jack'}
a = () => {}
a = []
```

在这三种情况下，ts都没有报错

于是上面的问题就找到原因了，_js引擎_并不知道这个result具体是个字面量对象，还是函数或者说是索引类型，所以它非常人性化的给你返回了<code>{}</code>，而<code>key</code>当作<code>{}</code>的索引就报错了。

## 解决办法

### 方案1

通过 **keyof** 的方式可以获取ts 类型的属性key的值

适用与非**函数**场景

```typescript
var foo = {
    a: '1',
    b: '2'
}
// 这里typeof foo => foo的类型 等同于 interface Foo { a: string; b: string; }// typeof foo === Foo，这里只所以用 typeof foo，因为这样方便，对于不想写interface的直接量对象很容易获取它的类型// keyof typeof foo这里只获取 Foo的类型的key值，注意这个keyof后面一定是 typescript的类型
type FooType = keyof typeof foo; var getPropertyValue = Object.keys(foo).map(item => foo[item as FooType])
```

### 方案2

将参数类型改为_key-value_对象

```typescript

const isNumber = (object: {[key: string]: unknown}) => {
  // 在一个函数里，改变传入的对象本身是不好的
  const result = { ...object }
  Object.keys(result).forEach(key => {
      const value = result[key];
      if(typeof value !== 'number') {
          delete result[key];
      }
  })
  return result;
}
```

