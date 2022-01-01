---
title: TypeScript进阶之泛型
date: 2021/5/2
tags: TypeScript
categories: Web前端
introduction: 泛型是指在定义函数、接口或者类时，未指定其参数类型，只有在运行时传入才能确定。那么此时的参数类型就是一个变量，通常用大写字母 `T` 来表示，当然你也可以使用其他字符，如：`U`、`K`等
---


## TypeScript 泛型

**通俗来讲**：泛型是指在定义函数、接口或者类时，未指定其参数类型，只有在运行时传入才能确定。那么此时的参数类型就是一个变量，通常用大写字母 `T` 来表示，当然你也可以使用其他字符，如：`U`、`K`等。

**语法**：在函数名、接口名或者类名添加后缀 `<T>`：

```ts
function generic<T>() {}
interface Generic<T> {}
class Generic<T> {}
```

### 初识泛型

**之所以使用泛型，是因为它帮助我们为不同类型的输入，复用相同的代码。**

比如写一个最简单的函数，这个函数会返回任何传入它的值。如果传入的是 number 类型：

```ts
function identity(arg: number): number {
    return arg
}
```

如果传入的是 string 类型：

```ts
function identity(arg: string): string {
    return arg
}
```

通过泛型，可以把两个函数统一起来：

```ts
function identity<T>(arg: T): T {
  return arg
}
```

需要注意的是，泛型函数的返回值类型是根据你的业务需求决定，并非一定要返回泛型类型 T：

```ts
function identity<T>(arg: T): string {
  return String(arg)
}
```

**代码解释：** 入参的类型是未知的，但是通过 String 转换，返回字符串类型。

### 多个类型参数

泛型函数可以定义多个类型参数：

```ts
function extend<T, U>(first: T, second: U): T & U {
  for(const key in second) {
    (first as T & U)[key] = second[key] as any
  }
  return first as T & U
}
```

**代码解释：** 这个函数用来合并两个对象，具体实现暂且不去管它，这里只需要关注泛型多个类型参数的使用方式，**其语法为通过逗号分隔 `<T, U, K>`**。

### 泛型参数默认类型

函数参数可以定义默认值，泛型参数同样可以定义默认类型：

实例演示

```typescript
function min<T = number>(arr:T[]): T{
  let min = arr[0]
  arr.forEach((value)=>{
     if(value < min) {
         min = value
     }
  })
   return min
}
console.log(min([20, 6, 8n])) // 6
```

**解释：** 同样的不用去关注这个最小数函数的具体实现，要知道**默认参数语法为 `<T = 默认类型>`**。

### 泛型类型与泛型接口

先来回顾下之前章节介绍的函数类型：

```ts
const add: (x: number, y: number) => string = function(x: number, y: number): string {
  return (x + y).toString()
}
```

等号左侧的 `(x: number, y: number) => string` 为函数类型。

再看下泛型类型：

```ts
function identity<T>(arg: T): T {
  return arg
}

let myIdentity: <T>(arg: T) => T = identity
```

同样的等号左侧的 `<T>(arg: T) => T` 即为泛型类型，它还有另一种*带有调用签名的对象字面量*书写方式：`{ <T>(arg: T): T }`:

```ts
function identity<T>(arg: T): T {
  return arg
}

let myIdentity: { <T>(arg: T): T } = identity
```

这就引导我们去写第一个泛型接口了。把上面例子里的对象字面量拿出来作为一个接口：

```ts
interface GenericIdentityFn {
  <T>(arg: T): T
}

function identity<T>(arg: T): T {
  return arg
}

let myIdentity: GenericIdentityFn = identity
```

进一步，把泛型参数当作整个接口的一个参数，我们可以把泛型参数提前到接口名上。这样我们就能清楚的知道使用的具体是哪个泛型类型：

```ts
interface GenericIdentityFn<T> {
  (arg: T): T
}

function identity<T>(arg: T): T {
  return arg
}

let myIdentity: GenericIdentityFn<number> = identity
```

注意，在使用泛型接口时，需要传入一个类型参数来指定泛型类型。示例中传入了 number 类型，这就锁定了之后代码里使用的类型。

### 泛型类

始终要记得，**使用泛型是因为可以复用不同类型的代码**。下面用一个最小堆算法举例说明泛型类的使用：

```ts
class MinClass {
  public list: number[] = []
  add(num: number) {
    this.list.push(num)
  }
  min(): number {
    let minNum = this.list[0]
    for (let i = 0; i < this.list.length; i++) {
      if (minNum > this.list[i]) {
        minNum = this.list[i]
      }
    }
    return minNum
  }
}
```

**代码解释：** 示例中我们实现了一个查找 number 类型的最小堆类，但我们的最小堆还需要支持字符串类型，此时就需要泛型的帮助了：

实例演示

```typescript
// 类名后加上 <T>
class MinClass<T> {
  public list: T[] = []
  add(num: T) {
    this.list.push(num)
  }
  min(): T {
    let minNum = this.list[0]
    for (let i = 0; i < this.list.length; i++) {
      if (minNum > this.list[i]) {
        minNum = this.list[i]
      }
    }
    return minNum
  }
}


let m = new MinClass<string>()
m.add('hello')
m.add('world')
m.add('generic')
console.log(m.min()) // generic
```

**代码解释：**

第 2 行，在声明 `类 MinClass` 的后面后加上了 `<T>`，这样就声明了泛型参数 T，作为一个变量可以是字符串类型，也可以是数字类型。

### 泛型约束

**语法：通过 `extends` 关键字来实现泛型约束。**

如果我们很明确传入的泛型参数是什么类型，或者明确想要操作的某类型的值具有什么属性，那么就需要对泛型进行约束。通过两个例子来说明：

```ts
interface User {
  username: string
}

function info<T extends User>(user: T): string {
  return 'imooc ' + user.username
}
```

**代码解释：** 示例中，第 5 行，我们约束了入参 user 必须包含 username 属性，否则在编译阶段就会报错。

下面再看另外一个例子：

```ts
type Args = number | string

class MinClass<T extends Args> {}

const m = new MinClass<boolean>() // Error, 必须是 number | string 类型
```

**代码解释：**

第 3 行，约束了泛型参数 T 继承自类型 Args，而类型 Args 是一个由 number 和 string 组成的联合类型。

第 5 行，泛型参数只能是 number 和 string 中的一种，传入 boolean 类型是错误的。



### 多重类型泛型约束

通过 `<T extends Interface1 & Interface2>` 这种语法来实现多重类型的泛型约束：

```ts
interface Sentence {
  title: string,
  content: string
}

interface Music {
  url: string
}

class Classic<T extends Sentence & Music> {
  private prop: T

  constructor(arg: T) {
    this.prop = arg
  }

  info() {
    return {
      url: this.prop.url,
      title: this.prop.title,
      content: this.prop.content
    }
  }
}
```

**代码解释：**

第 10 行，约束了泛型参数 `T` 需继承自交叉类型（后续有单节介绍） `Sentence & Music`，这样就能访问两个接口类型的参数。