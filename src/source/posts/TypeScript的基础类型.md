---
title: TypeScript基础类型
date: 2021/4/26
tags: TypeScript
categories: Web前端
introduction: Typescript基础类型介绍
---

## TypeScript 基础类型

TypeScript 中的类型有
> TypeScript中的基础类型都是小写，大写开头的表示的是javascript的构造函数

+ 原始类型
  + boolean
  + number
  + string
  + bigint
  + null
  + undefined
  + symbol
  + void
+ 元组 tuple
+ 枚举 enum
+ 任意 any
+ unknown
+ never
+ 数组 Array
+ 对象 object

###  void 类型

当一个函数没有返回值时，可以声明为void

```typescript
function doNothing(): void {
    let a = 10
}
```

还可以声明一个<code>void</code>类型的变量，但只能赋值为<code>undefined</code>或者<code>null</code>

```typescript
let nothing: void = undefined
```

###  null 类型和 undefined 类型

`undefined` 和 `null` 是**所有类型的子类型**。

一般项目是默认开启 `--strictNullChecks` 检测的，如果你将 `tsconfig.json` 中 `strictNullChecks` 选项设置为 `false`，下面这种操作不会报错，不过尽量不要这么做：

```ts
let num: number = undefined
let list: number[] = undefined
let name: string = undefined
```

###  数组类型

数组类型有两种表示方法，第一种在元素类型后接上 `[]`，表示由此类型元素组成的一个数组：

```ts
let list: number[] = [1, 2, 3]
let names: string[] = ['Sherlock', 'Watson', 'Mrs. Hudson']
```

另一种方式是使用数组泛型（*泛型后续会单独介绍*），`Array<元素类型>`：

```ts
let list: Array<number> = [1, 2, 3]
let names: Array<string> = ['Sherlock', 'Watson', 'Mrs. Hudson']
```

混合各种元素类型：

```ts
let list: any[] = ['Sherlock', 1887]
```

推荐使用第一种数组类型的表示方法，书写比较简洁直观。

###  any 类型

有时候接收来自用户的输入，我们是不能确定其变量类型的。这种情况下，我们不希望类型检查器对这些值进行检查，而是直接让它们通过编译阶段的检查，此时可以使用 `any`：

```ts
let input: any = 'nothing'

input = 0                   // ok
input = true                // ok
input = []                  // ok
input = null                // ok
input = Symbol('any')       // ok
```

如果一个数据是 any 类型，那么可以访问它的任意属性，即使这个属性不存在：

```ts
let anything: any = 10

anything.eat()              // ok
anything.name               // ok
anything[0]                 // ok
new anything()              // ok
anything()                  // ok
```

从上面的例子中可以看到，any 类型几乎可以做任何操作，这样很容易编写类型正确但是执行异常的代码。我们使用 TypeScript 就是为了代码的健壮性，所以要**尽量减少 any 的使用**。

> any类型很像在javascript直接定义一个变量

###  容易混淆的点

```ts
let a: Number = new Number('10') // a === 10 为 false
let b: number = Number('10') // b === 10 为 true

a instanceof Number // true
b instanceof Number // false
```

**代码解释：**

第 1 行，通过 `new Number('10')` 得到的是**一个构造函数，本质是一个对象**。

第 2 行，`Number('10')` 与 `10` 都是声明一个数字 10 的方法，本质就是一个数字。

第 4 - 5 行，`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。`a` 是一个对象，它的 `__proto__` 属性指向该对象的构造函数的原型对象 `Number`，所以为 `true`。`b` 是一个数字，所以为 `false`。

`__proto__` 是非标准属性，你也可以使用 **`Object.getPrototypeOf()`** 方法来访问一个对象的原型：

```js
a.__proto__ === Object.getPrototypeOf(a) // true
```

###  bigint

`bigint` 是一种基本数据类型（primitive data type）。

JavaScript 中可以用 `Number` 表示的最大整数为 `2^53 - 1`，可以写为 `Number.MAX_SAFE_INTEGER`。如果超过了这个界限，可以用 `BigInt`来表示，它可以表示任意大的整数。

在一个整数字面量后加 `n` 的方式定义一个 `BigInt`，如：`10n` 或者调用函数 `BigInt()`：

```ts
const theBiggestInt: bigint = 9007199254740991n
const alsoHuge: bigint = BigInt(9007199254740991)
const hugeString: bigint = BigInt("9007199254740991")

theBiggestInt === alsoHuge // true
theBiggestInt === hugeString // true
```

`BigInt` 与 `Number` 的不同点：

- `BigInt` 不能用于 `Math` 对象中的方法。
- `BigInt` 不能和任何 `Number` 实例混合运算，两者必须转换成同一种类型。
- `BigInt` 变量在转换为 `Number` 变量时可能会丢失精度。

`Number` 和 `BigInt` 可以进行比较：

```ts
0n === 0 // false

0n == 0 // true

1n < 2  // true

2n > 1  // true

2 > 2   // false

2n > 2  // false

2n >= 2 // true
```

条件判断：

```ts
if (0n) {
  console.log('条件成立!');
} else {
  console.log('条件不成立!'); // 输出结果
}

0n || 10n    // 10n

0n && 10n    // 0n

Boolean(0n)  // false

Boolean(10n) // true

!10n         // false

!0n          // true
```

###  symbol

`symbol` 是一种基本数据类型。

`Symbol()` 函数会返回 `symbol` 类型的值。每个从 `Symbol()` 返回的 `symbol` 值都是**唯一**的。

使用 Symbol() 创建新的 symbol 类型：

```ts
const sym1: symbol = Symbol()
const sym2: symbol = Symbol('foo')
const sym3: symbol = Symbol('foo')
代码块123
```

上面的代码创建了三个新的 symbol 类型，但要注意每个从 Symbol() 返回的值都是唯一的：

```ts
console.log(sym2 === sym3) // false
```

**代码解释：** 每个 `Symbol()` 方法返回的值都是唯一的，所以，sym2 和 sym3 不相等。

Symbol() 作为构造函数是不完整的：

```ts
const sym = new Symbol() // TypeError
```

这种语法会报错，是因为从 ECMAScript 6 开始**围绕原始数据类型创建一个显式包装器对象已不再被支持**，但因历史遗留原因， `new Boolean()`、`new String()` 以及 `new Number()` 仍可被创建：

```ts
const symbol = new Symbol()   // TypeError
const bigint = new BigInt()   // TypeError

const number = new Number()   // OK
const boolean = new Boolean() // OK
const string = new String()   // OK
```

####  symbol使用场景

+ 当一个对象有较多属性时（*往往分布在不同文件中由模块组合而成*），很容易将某个属性名覆盖掉，使用 `Symbol` 值可以避免这一现象，比如 `vue-router` 中的 `name` 属性。

```ts
// a.js 文件
export const aRouter = {
  path: '/index',
  name: Symbol('index'),
  component: Index
},

// b.js 文件

export const bRouter = {
  path: '/home',
  name: Symbol('index'), // 不重复
  component: Home
},

// routes.js 文件
import { aRouter } from './a.js'
import { bRouter } from './b.js'

const routes = [
  aRouter,
  bRouter
]
```

**代码解释：** 两个不同文件使用了同样的 `Symbol('index')` 作为属性 name 的值，因 symbol 类型的唯一性，就避免了**重复定义**。

+ 模拟类的**私有方法**

```ts
const permission: symbol = Symbol('permission')

class Auth {
  [permission]() {
    // do something
  }
}
```

这种情况**通过类的实例是**无法取到该方法，模拟类的私有方法。

但是，TypeScript 是可以使用 `private` 关键字的，所以这种方法可以在 JavaScript 中使用。

+ 判断是否可以用 `for...of` 迭代

```ts
if (Symbol.iterator in iterable) {
    for(let n of iterable) {
      console.log(n)
    }
}
```

这个知识点后续会在 `迭代器` 那一节会着重介绍，这里可以先知晓：

   `for...of` 循环内部调用的是数据结构的 `Symbol.iterator` 方法。
   `for...of` 只能迭代可枚举属性。

+ Symbol.prototype.description

`Symbol([description])` 中可选的字符串即为这个 Symbol 的描述，如果想要获取这个描述：

```js
const sym: symbol = Symbol('imooc')

console.log(sym);               // Symbol(imooc)
console.log(sym.toString());    // Symbol(imooc)
console.log(sym.description);   // imooc
```

###  元组

通过元组可以存储不同类型的元素，而非像数组那样只能存储相同元素类型（any[] 除外）。

声明一个由 `string` 和 `number` 构成的元组：

```ts
const list: [string, number] = ['Sherlock', 1887]   // ok

const list1: [string, number] = [1887, 'Sherlock']  // error
```

**代码解释：** 元组中规定的元素类型**顺序必须是完全对照的**，而且**不能多、不能少**（数量也必须一样，数组有了长度）`list1` 中定义的第一个元素为 `string`类型，不能赋值为 `number`类型的数据。

当赋值或访问一个已知索引的元素时，会得到正确的类型：

```ts
const list: [string, number] = ['Sherlock', 1887]

list[0].substr(1)  // ok
list[1].substr(1)  // Property 'substr' does not exist on type 'number'.
```

**代码解释：**

第 3 行，`list[0]` 是一个字符串类型，拥有 substr() 方法。

第 4 行，`list[1]` 是一个数字类型，没有 substr() 方法，所以报错。

要注意元组的越界问题，虽然**可以越界添加元素**（*不建议*），但是**不可越界访问**：

```ts
const list: [string, number] = ['Sherlock', 1887]
list.push('hello world')

console.log(list)      // ok [ 'Sherlock', 1887, 'hello world' ]
console.log(list[2])   // Tuple type '[string, number]' of length '2' has no element at index '2'
```

**代码解释：**

第 2 行，向一个声明了**只有两个元素的元组**继续添加元素，这种操作虽然可行，但是严重不建议！

第 5 行，该元组只有两个元素，不可越界访问第三个元素。



元组类型允许在元素类型后缀一个 `?` 来说明元素是可选的：

```ts
const list: [number, string?, boolean?]
list = [10, 'Sherlock', true]
list = [10, 'Sherlock']
list = [10]
```

**可选元素必须在必选元素的后面，也就是如果一个元素后缀了 `?`号，其后的所有元素都要后缀 `?`号**。



元组可以作为参数传递给函数，函数的 Rest 形参可以定义为元组类型（动态长度）：

```ts
declare function rest(...args: [number, string, boolean]): void
```

等价于：

```ts
declare function rest(arg1: number, arg2: string, arg3: boolean): void
```

> **TIPS：** 在声明文件（.d.ts）中，关键字 declare 表示声明作用。声明文件用于编写第三方类库，通过配置 `tsconfig.json` 文件中的 `declaration 为 true`，在编译时可自行生成。

还可以这样：

```ts
const list: [number, ...string[]] = [10, 'a', 'b', 'c']

const list1: [string, ...number[]] = ['a', 1, 2, 3]
```

**代码解释：** Rest 元素指定了元组类型是无限扩展的，可能有零个或多个具有数组元素类型的额外元素。

###  枚举

需要定义一组相同主题的常量数据时，应该立即想到枚举类型。在学习过程中，需要注意枚举类型的**正向映射和反向映射**

使用枚举我们可以定义一些**带名字的常量**。TypeScript 支持**数字**的和基于**字符串**的枚举。

枚举类型弥补了 JavaScript 的设计不足，很多语言都拥有枚举类型。

当我们需要一组相同主题下的数据时，枚举类型就很有用了。

```ts
enum Direction { Up, Down, Left, Right }

enum Months { Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec }

enum Size { big = '大', medium = '中', small = '小' }

enum Agency { province = 1, city = 2, district = 3 }
```

声明一个枚举类型，如果没有赋值，它们的值默认为**数字类型**且从 0 开始累加：

```ts
enum Months {
  Jan,
  Feb,
  Mar,
  Apr
}

Months.Jan === 0 // true
Months.Feb === 1 // true
Months.Mar === 2 // true
Months.Apr === 3 // true
```

现实中月份是从 1 月开始的，那么只需要这样：

```ts
// 从第一个数字赋值，往后依次累加
enum Months {
  Jan = 1,
  Feb,
  Mar,
  Apr
}

Months.Jan === 1 // true
Months.Feb === 2 // true
Months.Mar === 3 // true
Months.Apr === 4 // true
```

枚举类型的值为**字符串类型**：

实例演示

```typescript
enum TokenType {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken'
}

// 两种不同的取值写法
console.log(TokenType.ACCESS === 'accessToken')        // true
console.log(TokenType['REFRESH'] === 'refreshToken')   // true
```

**代码解释：** 枚举的取值，有 `TokenType.ACCESS` 和 `TokenType['ACCESS']` 这两种不同的写法，效果是相同的。

**数字类型和字符串类型可以混合使用，但是不建议：**

```ts
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

枚举类型的值可以是一个简单的**计算表达式**：

实例演示

```typescript
enum Calculate {
  a,
  b,
  expired = 60 * 60 * 24,
  length = 'imooc'.length,
  plus = 'hello ' + 'world'
}

console.log(Calculate.expired)   // 86400
console.log(Calculate.length)    // 5
console.log(Calculate.plus)      // hello world
1234567891011
```

**Tips:**

- 计算结果必须为常量。
- 计算项必须放在最后。

所谓的反向映射就是指枚举的取值，不但可以正向的 `Months.Jan` 这样取值，也可以反向的 `Months[1]` 这样取值。

```ts
console.log(Months.Mar === 3) // true

// 那么反过来能取到 Months[3] 的值吗？
console.log(Months[3])  // 'Mar'

// 所以
console.log(Months.Mar === 3)     // true
console.log(Months[3] === 'Mar')  // true
```

**Tips:**

1. 字符串枚举成员不会生成反向映射。
2. 枚举类型被编译成一个对象，它包含了正向映射（ name -> value）和反向映射（ value -> name）。

在枚举上使用 `const` 修饰符：

```ts
enum Months {
  Jan = 1,
  Feb,
  Mar,
  Apr
}

const month = Months.Mar
```

查看一下编译后的内容：

```js
'use strict'
const month = 3 /* Mar */
代码块12
```

发现枚举类型应该编译出的对象没有了，只剩下 `month` 常量。这就是使用 `const` 关键字声明枚举的作用。因为变量 `month` 已经使用过枚举类型，在编译阶段 TypeScript 就将枚举类型抹去，这也是**性能提升**的一种方案。

分开声明名称相同的枚举类型，会**自动合并**：

实例演示

```typescript
enum Months {
  Jan = 1,
  Feb,
  Mar,
  Apr
}

enum Months {
  May = 5,
  Jun
}

console.log(Months.Apr) // 4
console.log(Months.Jun) // 6
```

## TypeScript Never 与 Unknown

本节介绍 never 和 unknown 类型，其中 unknown 类型作为 any 类型对应的安全类型使用起来更加安全，如果有**any 类型的使用需求**，应尽量使用 **unknown 类型来替代 **any 类型。

`never` 类型表示那些永不存在的值的类型。

`unknown` 类型是 `any` 类型对应的安全类型。

###  Never

一个抛出异常的函数表达式，其函数返回值类型为 never：

```ts
function error(message:string): never {
  throw new Error(message)
}
```

同样的，不会有返回值的函数表达式，其函数返回值类型也为 never:

```ts
// 推断的返回值类型为 never
function fail(): never {
    return error("Something failed")
}
```

不能取得值的地方：

```ts
interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

type All = Foo | Bar

function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      break
    case 'bar':
      break
    default:
      // 此处不能取值
      const exhaustiveCheck: never = val
      break
  }
}
```

###  Unknown

我们知道 any 无需事先执行任何类型的检查：

```ts
let value: any

value = true             // OK
value = 10               // OK
value = "Hello World"    // OK
value = []               // OK
value = {}               // OK
value = Math.random      // OK
value = null             // OK
value = undefined        // OK
value = new TypeError()  // OK
value = Symbol('name')   // OK

value.foo.bar            // OK
value.trim()             // OK
value()                  // OK
new value()              // OK
value[0][1]              // OK
```

在许多情况下，这太宽松了。 `unknown` 类型呢？

```ts
let value: unknown

value = true             // OK
value = 10               // OK
value = "Hello World"    // OK
value = []               // OK
value = {}               // OK
value = Math.random      // OK
value = null             // OK
value = undefined        // OK
value = new TypeError()  // OK
value = Symbol('name')   // OK
```

所有对该 `value` 变量的分配都被认为是类型正确的。

但是，如果尝试：

```ts
let value: unknown

let value1: unknown = value   // OK
let value2: any = value       // OK

let value3: boolean = value   // Error
let value4: number = value    // Error
let value5: string = value    // Error
let value6: object = value    // Error
let value7: any[] = value     // Error
```

可以看到，该 unknown 类型**只能分配给 any 类型和 unknown 类型**本身。

现在继续尝试：

```ts
let value: unknown

value.foo.bar  // Error
value.trim()   // Error
value()        // Error
new value()    // Error
value[0][1]    // Error
```

**`unknown` 类型在被确定为某个类型之前，不能被进行诸如函数执行、实例化等操作，一定程度上对类型进行了保护。**

> 在那些将取得任意值，但不知道具体类型的地方使用 `unknown`，而非 `any`。

## TypeScript 接口(Interface)

> TypeScript 的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在 TypeScript 里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。——官方定义

接口是对 JavaScript 本身的随意性进行约束，通过定义一个接口，**约定了变量、类、函数等**应该按照什么样的格式进行声明，实现多人合作的一致性。TypeScript 编译器依赖接口用于类型检查，最终编译为 JavaScript 后，接口将会被移除。

**接口主要是对对象、函数、类的类型做一些定义**

```ts
// 语法格式
interface DemoInterface {

}
```

###  应用场景

在声明一个**对象**、**函数**或者**类**时，先定义接口，确保其数据结构的一致性。

在多人协作时，定义接口尤为重要。

###  接口的好处

过去我们写 JavaScript 定义一个函数：

```js
function getClothesInfo(clothes) {
  console.log(clothes.price)
}

let myClothes = {
  color: 'black', 
  size: 'XL', 
  price: 98 
}
getClothesInfo(myClothes)
```

之前我们写 JavaScript 这样是很正常的，但同时你可能会遇到下面这些问题:

```js
getClothesInfo() // Uncaught TypeError: Cannot read property 'price' of undefined
getClothesInfo({ color: 'black' }) // undefined
```

相信原因你也知道，JavaScript 是 `弱类型` 语言，并不会对传入的参数进行任何检测，错误在运行时才被发现。那么通过定义 `接口`，在编译阶段甚至开发阶段就避免掉这类错误，接口**将检查类型是否和某种结构做匹配**。

####  举例说明

下面通过接口的方式重写之前的例子：

实例演示

```typescript
interface Clothes {
  color: string;
  size: string;
  price: number;
}

function getClothesInfo(clothes: Clothes) {
  console.log(clothes.price)
}

let myClothes: Clothes = { 
  color: 'black', 
  size: 'XL', 
  price: 98 
}

getClothesInfo(myClothes)
```

**代码解释：** 代码中，定义了一个接口 `Clothes`，在传入的变量 `clothes` 中，它的类型为 `Clothes`。这样，就约束了这个传入对象的 `外形` 与接口定义一致。只要传入的对象满足上面的类型约束，那么它就是被允许的。

**Tips：**

1. 定义接口要 `首字母大写`。
2. 只需要关注值的 `外形`，并不像其他语言一样，定义接口是为了实现。
3. 如果没有特殊声明，定义的变量比接口少了一些属性是不允许的，多一些属性也是不允许的，赋值的时候，变量的形状必须和接口的形状保持一致。

###  接口的属性



####  可选属性

接口中的属性不全是必需的。可选属性的含义是该属性在被变量定义时可以不存在。

```ts
// 语法
interface Clothes {
  color?: string;
  size: string;
  price: number;
}

// 这里可以不定义属性 color
let myClothes: Clothes = { 
  size: 'XL', 
  price: 98 
}
```

带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个 `?` 符号。

这时，**仍不允许添加未定义的属性**，如果引用了不存在的属性时 TS 将直接捕获错误。



#### 只读属性(和const对应，一个是属性一个是变量)

一些对象属性**只能在对象刚刚创建的时候修改其值**。你可以在属性名前用 `readonly` 来指定只读属性，比如价格是不能被修改的:

```ts
// 语法
interface Clothes {
  color?: string;
  size: string;
  readonly price: number;
}

// 创建的时候给 price 赋值
let myClothes: Clothes = { 
  size: 'XL', 
  price: 98 
}

// 不可修改
myClothes.price = 100
// error TS2540: Cannot assign to 'price' because it is a constant or a read-only property
```

TypeScript 可以通过 `ReadonlyArray<T>` 设置数组为只读，那么它的所有**写方法**都会失效。

```ts
let arr: ReadonlyArray<number> = [1,2,3,4,5];
arr[0] = 6; // Index signature in type 'readonly number[]' only permits reading
```

**代码解释：** 代码中的泛型语法在之后会有专门的小节介绍。

##### readonly` vs `const`

最简单判断该用 `readonly` 还是 `const` 的方法是看要把它做为**变量使用还是做为一个属性**。做为 `变量` 使用的话用 const，若做为 `属性` 则使用 readonly。



#### 任意属性

有时候我们希望接口允许有任意的属性，语法是用 `[]` 将属性包裹起来：

```ts
// 语法
interface Clothes {
  color?: string;
  size: string;
  readonly price: number;
  [propName: string]: any;
}

// 任意属性 activity
let myClothes: Clothes = { 
  size: 'XL', 
  price: 98,
  activity: 'coupon'
}
```

**代码解释：** 这里的接口 `Clothes` 可以有任意数量的属性，并且只要它们不是 `color` `size` 和 `price`，那么就无所谓它们的类型是什么。

- 项目案例：使用 axios 库发起 HTTP 传输的时候，可以写入一个自定义的属性，就是因为源码中定义了一个任意属性：

```ts
this.$axios({
  method: 'put',
  url: '/cms/user',
  data: {
    nickname: this.nickname,
  },
  showBackend: true,
})
```

###  函数类型

除了描述带有属性的普通对象外，接口也可以描述**函数类型。**

为了使接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个**只有 `参数列表` 和 `返回值类型` 的函数定义**。

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string): boolean {
  return source.search(subString) > -1;
}
```

对于函数类型的类型检查来说，**函数的参数名不需要与接口里定义的名字相匹配**。你可以改变函数的参数名，**只要保证函数参数的位置不变。函数的参数会被逐个进行检查：**

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
// source => src, subString => sub
mySearch = function(src: string, sub: string): boolean {
  return src.search(sub) > -1;
}
```

如果你不想指定类型，TypeScript 的类型系统会推断出参数类型，因为函数直接赋值给了 SearchFunc 类型变量。

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(src, sub) {
  let result = src.search(sub);
  return result > -1;
}
```

**如果接口中的函数类型带有函数名，下面两种书写方式是等价的：**

```ts
interface Calculate {
  add(x: number, y: number): number
  multiply: (x: number, y: number) => number
}
```



### 可索引类型

可索引类型接口读起来有些拗口，直接看例子：

```js
// 正常的js代码
let arr = [1, 2, 3, 4, 5]
let obj = {
  brand: 'imooc',
  type: 'education'
}

arr[0]
obj['brand']
```

再来看定义可索引类型接口：

```ts
interface ScenicInterface {
  [index: number]: string
}

let arr: ScenicInterface = ['西湖', '华山', '故宫']
let favorite: string = arr[0]
```

示例中索引签名是 `number类型`，返回值是字符串类型。

另外还有一种索引签名是 `字符串类型`。我们可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。通过下面的例子理解这句话：

```ts
// 正确
interface Foo {
  [index: string]: number;
  x: number;
  y: number;
}

// 错误
interface Bar {
  [index: string]: number;
  x: number;
  y: string; // Error: y 属性必须为 number 类型， 代表用y去索引返回string
}
```

**代码解释：**

语法错误是因为当使用 number 来索引时，JavaScript 会将它转换成 string 然后再去索引对象。也就是说用 100（一个number）去索引等同于使用"100"（一个string）去索引，因此两者需要保持一致。



### 类类型

我们希望**类的实现必须遵循接口定义**，那么可以使用 `implements` 关键字来确保兼容性。

这种类型的接口在传统面向对象语言中最为常见，比如 java 中接口就是这种类类型的接口。**这种接口与抽象类比较相似，但是接口只能含有抽象方法和成员属性，实现类中必须实现接口中所有的抽象方法和成员属性。**

```ts
interface AnimalInterface {
  name: string;
}

class Dog implements AnimalInterface {
  name: string;
    
  constructor(name: string){
    this.name = name
  }
}
```

你也可以在接口中描述一个方法，在类里实现它:

```ts
interface AnimalInterface {
  name: string

  eat(m: number): string
}

class Dog implements AnimalInterface {
  name: string;

  constructor(name: string){
    this.name = name
  }

  eat(m: number) {
    return `${this.name}吃肉${m}分钟`
  }
}
 
```

接口描述了类的公共部分，而不是公共和私有两部分。 它**不会帮你检查类是否具有某些私有成员。**



### 继承接口

和类一样，接口也可以通过关键字 `extents` 相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

```ts
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = {} as Square;
// 继承了 Shape 的属性
square.color = "blue";
square.sideLength = 10;
```

一个接口可以继承多个接口，创建出多个接口的合成接口。

```ts
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```



### 混合类型

在前面已经介绍，接口可以**描述函数、对象的方法或者对象的属性。**

有时希望一个对象同时具有上面提到多种类型，比如一个**对象可以当做函数使用，同时又具有属性和方法。**

```ts
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function (start: number) { } as Counter;
  counter.interval = 123;
  counter.reset = function () { };
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

**代码解释：**

第 1 行，声明一个接口，**如果只有 `(start: number): string` 一个成员，那么这个接口就是函数接口**，同时还具有其他两个成员，可以用来描述对象的属性和方法，这样就构成了一个混合接口。

第 7 行，创建一个 `getCounter()` 函数，它的返回值是 Counter 类型的。

```ts
let counter = function (start: number) { } as Counter;
```

第 8 行，通过类型断言，将函数对象转换为 `Counter` 类型，转换后的对象不但实现了函数接口的描述，使之成为一个函数，还具有 interval 属性和 reset() 方法。断言成功的条件是，两个数据类型只要有一方可以赋值给另一方，这里函数类型数据不能赋值给接口类型的变量，因为它不具有 interval 属性和 reset() 方法。

类型断言在之后的小节也会单节介绍。

## TypeScript 类(Class)

### 访问修饰符

TypeScript 可以使用四种访问修饰符 <code>public</code>、<code>protected</code>、<code>private</code> 和 <code>readonly</code>。



#### 4.1 public

TypeScript 中，类的成员全部默认为 `public`，当然你也可以显式的将一个成员标记为 `public`，标记为 `public` 后，在程序类的外部可以访问。

```ts
class Calculate {
  // 类的属性
  public x: number
  public y: number

  // 构造函数
  public constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public add () {
    return this.x + this.y
  }
}
```



#### 4.2 protected

当成员被定义为 `protected` 后，只能被**类的内部以及类的子类访问**。

```ts
class Base {
  protected baseUrl: string = 'http://api.com/'

  constructor() {}

  protected request(method: string) {
    const url = `${this.baseUrl}${method}`
    // TODO 封装基础的 http 请求
  }
}

class Address extends Base {
  get() {
    return this.request('address')
  }
}
```

**代码解释：**

第 2 行，Base 类的属性 baseUrl 被定义为受保护的，那么第 7 行该属性在类中被访问是可以的。

第 14 行，因 Address 类是 Base 类的子类，在子类中允许访问父类中被定义为受保护类型的方法 request() 。



#### 4.3 private

当类的成员被定义为 `private` 后，只能被**类的内部访问**。

```ts
class Mom {
  private labour() {
    return 'baby is coming'
  }
}

class Son extends Mom {
  test () {
    this.labour() // Error, Property 'labour' is private and only accessible within class 'Mom'
  }
}
代码块1234567891011
```

**代码解释：**

第 9 行，父类中的 labour() 方法被定义为私有方法，只能在父类中被使用，子类中调用报错。



#### 4.4 readonly

通过 `readonly` 关键字将属性设置为只读的。**只读属性必须在声明时或构造函数里被初始化。**

```ts
class Token {
  readonly secret: string = 'xjx*xh3GzW#3'

  readonly expired: number

  constructor (expired: number) {
    this.expired = expired
  } 
}

const token = new Token(60 * 60 * 24)
token.expired = 60 * 60 * 2 // Error, expired 是只读的
```

**代码解释：**

最后一行，因 Token 类的属性 expired 被设置为只读属性，不可被修改。



### 5. 静态方法

通过 `static` 关键字来创建类的静态成员，这些属性存在于**类本身上面而不是类的实例上**。

```ts
class User {
  static getInformation () {
    return 'This guy is too lazy to write anything.'
  }
}

User.getInformation() // OK

const user = new User()
user.getInformation() // Error 实例中无此方法
```

**代码解释：** getInformation() 方法被定义为静态方法，只存在于类本身上，类的实例无法访问。

静态方法调用同一个类中的其他静态方法，可使用 this 关键字。

```ts
class StaticMethodCall {

  static staticMethod() {
      return 'Static method has been called'
  }
  static anotherStaticMethod() {
      return this.staticMethod() + ' from another static method'
  }

}
```

**代码解释：** 静态方法中的 `this` 指向类本身，而静态方法也存在于类本身，所以可以在静态方法中用 this 访问在同一类中的其他静态方法。

非静态方法中，不能直接使用 `this` 关键字来访问静态方法。而要用类本身或者构造函数的属性来调用该方法：

```ts
class StaticMethodCall {
  constructor() {
      // 类本身调用
      console.log(StaticMethodCall.staticMethod())

      // 构造函数的属性调用
      console.log(this.constructor.staticMethod())
  }
  static staticMethod() {
      return 'static method has been called.'
  }
}
```

**代码解释：** 类指向其构造函数本身，在非静态方法中，`this.constructor === StaticMethodCall` 为 `true`， 也就是说这两种写法等价。



### 抽象类

抽象类作为其它派生类的基类使用，它们一般不会直接被实例化，不同于接口，抽象类可以包含成员的实现细节。

`abstract` 关键字是用于定义抽象类和在抽象类内部定义抽象方法。

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}

const animal = new Animal() // Error, 无法创建抽象类实例

```

通常我们需要创建子类继承抽象类，将抽象类中的抽象方法一一实现，这样在大型项目中可以很好的约束子类的实现。

```ts
class Dog extends Animal {
  makeSound() {
    console.log('bark bark bark...')
  }
}

const dog = new Dog()

dog.makeSound()  // bark bark bark...
dog.move()       // roaming the earch...

```



###  把类当做接口使用

类也可以作为接口来使用，这在项目中是很常见的。

```ts
class Pizza {
  constructor(public name: string, public toppings: string[]) {}
}

class PizzaMaker {
  // 把 Pizza 类当做接口
  static create(event: Pizza) {
    return new Pizza(event.name, event.toppings)
  }
}

const pizza = PizzaMaker.create({ 
  name: 'Cheese and nut pizza', 
  toppings: ['pasta', 'eggs', 'milk', 'cheese']
})

```

第 7 行，把 Pizza 类当做接口。

因为接口和类都定义了对象的结构，在某些情况下可以互换使用。如果你需要创建一个可以自定义参数的实例，同时也可以进行类型检查，把类当做接口使用不失为一个很好的方法。

这就是 TypeScript 的强大功能，而且非常灵活，**拥有全面的面向对象设计和通用的类型检查**。

## TypeScript函数

### 函数类型

在 TypeScript 中编写函数，需要给形参和返回值指定类型：

```ts
const add = function(x: number, y: number): string {
  return (x + y).toString()
}

```

**代码解释：**

参数 x 和 y 都是 number 类型，两个参数相加后将其类型转换为 string， 所以整个函数的返回值为 string 类型。

上面的代码只是对 `=` 等号右侧的匿名函数进行了类型定义，等号左侧的 `add` 同样可以添加类型：

```ts
const add: (x: number, y: number) => string = function(x: number, y: number): string {
  return (x + y).toString()
}

```

可以看到，等号左侧的类型定义由两部分组成：参数类型和返回值类型，通过 `=>` 符号来连接。

这里要注意：**函数类型的 `=>` 和 箭头函数的 `=>` 是不同的含义**。

通过箭头函数改写一下刚才写的函数:

```ts
const add = (x: number, y: number): string => (x + y).toString()

```

等号左右两侧书写完整：

```ts
// 只要参数位置及类型不变，变量名称可以自己定义，比如把两个参数定位为 a b
const add: (a: number, b: number) => string = (x: number, y: number): string => (x + y).toString()
```



### 函数的参数



#### 参数个数保持一致

TypeScript 中每个函数参数都是必须的。 这不是指不能传递 null 或 undefined 作为参数，而是说编译器会检查用户是否为每个参数都传入了值。简短地说，传递给一个函数的参数个数必须与函数期望的参数个数一致。

```ts
const fullName = (firstName: string, lastName: string): string => `${firstName}${lastName}`

let result1 = fullName('Sherlock', 'Holmes')
let result2 = fullName('Sherlock', 'Holmes', 'character') // Error, Expected 2 arguments, but got 3
let result3 = fullName('Sherlock')                        // Error, Expected 2 arguments, but got 1

```

**代码解释：**

第 1 行，一个需要传入 2 个字符串类型参数的函数类型定义。

第 4 行，`result2` 传入了 3 个参数，与声明的 2 个参数不符。

第 5 行，`result3` 只传入了 1 个参数，同样与声明的 2 个参数不符。



#### 可选参数

在 JavaScript 中每个参数都是可选的，可传可不传。没传参的时候，它的值就是 undefined。 而在 TypeScript 里我们可以在参数名旁使用 `?` 实现可选参数的功能，**可选参数必须跟在必须参数后面**。

```ts
const fullName = (firstName: string, lastName?: string): string => `${firstName}${lastName}`

let result1 = fullName('Sherlock', 'Holmes')
let result2 = fullName('Sherlock', 'Holmes', 'character') // Error, Expected 1-2 arguments, but got 3
let result3 = fullName('Sherlock')                        // OK
```

**代码解释：**

第 1 行，firstName 是必须参数，lastName 是可选参数。

第 4 行，传入了 3 个参数，与声明的 2 个参数不符。

第 5 行，lastName 是可选参数，可以省略。



#### 默认参数

参数可以取默认值，上面介绍的**可选参数必须跟在必须参数后面**，而**带默认值的参数不需要放在必须参数的后面，可随意调整位置**：

```ts
const token = (expired = 60*60, secret: string): void  => {}
// 或
const token1 = (secret: string, expired = 60*60 ): void => {}
```

**代码解释：**

第 1 行，带默认值的参数 expired 在参数列表首位。

第 3 行，带默认值的参数 expired 在参数列表末位。



#### 剩余参数

有的时候，函数的参数个数是不确定的，可能传入未知个数，这时没有关系，有一种方法可以解决这个问题。

通过 `rest 参数` (形式为 `...变量名`)来获取函数的剩余参数，这样就不需要使用 `arguments` 对象了。

```ts
function assert(ok: boolean, ...args: string[]): void {
  if (!ok) {
    throw new Error(args.join(' '));
  }
}

assert(false, '上传文件过大', '只能上传jpg格式')
```

**代码解释：**

第 1 行，第二个参数传入剩余参数，且均为字符串类型。

第 7 行，调用函数 `assert()` 时，除了第一个函数传入一个布尔类型，接下来可以无限传入多个字符串类型的参数。

> **TIP：注意 `rest 参数` 只能是最后一个参数。**



#### this 参数

JavaScript 里，this 的值在函数被调用的时候才会被指定，但是这个 this 到底指的是什么还是需要花点时间弄清楚。

默认情况下，`tsconfig.json` 中，编译选项 `compilerOptions` 的属性 `noImplicitThis` 为 `false`，我们在一个对象中使用的 this 时，它的类型是 any 类型。

```ts
let triangle = {
  a: 10,
  b: 15,
  c: 20,
  area: function () {
    return () => {
      // this 为 any 类型
      const p = (this.a + this.b + this.c) / 2
      return Math.sqrt(p * (p - this.a) * (p - this.b) *(p - this.c))
    }
  }
}

const myArea = triangle.area()
console.log(myArea())
```

**代码解释：**

在实际工作中 any 类型是非常危险的，我们可以添加任意属性到 any 类型的参数上，比如将 `const p = (this.a + this.b + this.c) / 2` 这句改为 `const p = (this.d + this.d + this.d) / 2` 也不会报错，这很容易造成不必要的问题。

所以我们应该明确 this 的指向，下面介绍两种方法：

第一种，在 `tsconfig.json` 中，将编译选项 `compilerOptions` 的属性 `noImplicitThis` 设置为 `true`，TypeScript 编译器就会帮你进行正确的类型推断：

```ts
let triangle = {
  a: 10,
  b: 15,
  c: 20,
  area: function () {
    return () => {
      const p = (this.a + this.b + this.c) / 2
      return Math.sqrt(p * (p - this.a) * (p - this.b) *(p - this.c))
    }
  }
}

const myArea = triangle.area()
console.log(myArea())
```

**代码解释：**

将 `noImplicitThis` 设置为 `true` 以后，把鼠标放在第 7 行的 `this` 上，可以看到：

```
  this: {
    a: number;
    b: number;
    c: number;
    area: () => () => number;
  }
```

这时，TypeScript 编译器就能准确的知道了 this 的类型，如果取不存在于 this 属性中的 `d`，将会报错 `Property 'd' does not exist on type '{ a: number; b: number; c: number; area: () => () => any; }'`

除了这种方法，我们还可以通过 `this 参数` 这种形式来解决 this 为 any 类型这一问题。提供一个显式的 `this` 参数，它出现在参数列表的最前面：

```ts
// 语法
function f(this: void) {

}
```

改造刚才的例子：

实例演示

```typescript
interface Triangle {
  a: number;
  b: number;
  c: number;
  area(this: Triangle): () => number;
// area接受一个Triangle类型的this参数，返回一个函数，这个函数的返回类型是number
}

let triangle: Triangle = {
  a: 10,
  b: 15,
  c: 20,
  area: function (this: Triangle) {
    return () => {
      const p = (this.a + this.b + this.c) / 2
      return Math.sqrt(p * (p - this.a) * (p - this.b) *(p - this.c))
    }
  }
}

const myArea = triangle.area()
console.log(myArea())
```



**代码解释：**

我们声明了一个接口 `Triangle`，其中的函数类型显式的传入了 `this` 参数，这个参数的类型为 `Triangle` 类型（第 5 行）：

```
area(this: Triangle): () => number;
```

此时，在第 14 行，`this` 指向 `Triangle`，就可以进行正确的类型判断，如果取未定义参数，编译器将直接报错。



### 函数重载

函数重载是指函数根据传入不同的参数，返回不同类型的数据。

它的意义在于让你清晰的知道传入不同的参数得到不同的结果，如果传入的参数不同，但是得到相同类型的数据，那就不需要使用函数重载。

比如面试中常考的字符反转问题，这里就不考虑负数情况了，只是为了演示函数重载：

```js
function reverse(target: string | number) {
  if (typeof target === 'string') {
    return target.split('').reverse().join('')
  }
  if (typeof target === 'number') {
    return +[...target.toString()].reverse().join('')
  }
}
rse('imooc'))   // coomi
console.log(reverse(23874800))  // 847832

```

编译器并不知道入参是什么类型的，返回值类型也不能确定。这时可以为同一个函数提供多个函数类型定义来进行函数重载。

(通过 `--downlevelIteration` 编译选项增加对生成器和迭代器协议的支持)

实例演示

```typescript
function reverse(x: string): string
function reverse(x: number): number

function reverse(target: string | number) {
  if (typeof target === 'string') {
    return target.split('').reverse().join('')
  }
  if (typeof target === 'number') {
    return +[...target.toString()].reverse().join('')
  }
}
console.log(reverse('imooc'))   // coomi
console.log(reverse(23874800))  // 847832
```

**代码解释：**

因为这个反转函数在传入字符串类型的时候返回字符串类型，传入数字类型的时候返回数字类型，所以在前两行进行了两次函数类型定义。在函数执行时，根据传入的参数类型不同，进行不同的计算。

为了让编译器能够选择正确的检查类型，它会从重载列表的第一个开始匹配。因此，在定义重载时，一定要**把最精确的定义放在最前面**。



### 使用函数时的注意事项

1. 如果一个函数没有使用 `return` 语句，则它默认返回 `undefined`。
2. 调用函数时，传递给函数的值被称为函数的 `实参`（值传递），对应位置的函数参数被称为 `形参`。
3. 在函数执行时， `this` 关键字并不会指向正在运行的函数本身，而是 `指向调用函数的对象`。
4. `arguments` 对象是所有（非箭头）函数中都可用的 `局部变量`。你可以使用 arguments 对象在函数中引用函数的参数。

## TypeScript 字面量类型

通俗的讲，字面量也可以叫直接量，就是你看见什么，它就是什么。

我们之前介绍字符串类型，其实是一个集合类型，所有的字符串集合在一起构成了 string 类型。而字符串字面量类型就直接多了，你定义为 `'imooc'`，那这个变量的类型就是 `'imooc'` 类型。

### 字符串字面量类型

字符串字面量类型允许你指定字符串必须的固定值。

```ts
let protagonist: 'Sherlock'

protagonist = 'Sherlock'
protagonist = 'Watson' // Error, Type '"Watson"' is not assignable to type '"Sherlock"'
```

**代码解释：** 变量 `protagonist` 被声明为 `'Sherlock'` 字面量类型，就只能赋值为 `'Sherlock'`。

```ts
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out'

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
      if (easing === 'ease-in') {}
      else if (easing === 'ease-out') {}
      else if (easing === 'ease-in-out') {}
      else {
          // Error, 不应该传递 null 或 undefined
      }
  }
}

let button = new UIElement()
button.animate(0, 0, 'ease-in')
button.animate(0, 0, 'uneasy') // Error, 'uneasy' 不被允许
```

**代码解释：**

第 1 行，通过类型别名，声明了类型 `Easing` 为 `'ease-in' | 'ease-out' | 'ease-in-out'`
这样三个字符串字面量构成的联合类型。

第 4 行，你**只能**从三种允许的字符中选择**其一**来做为参数传递，传入其它值则会产生错误。

字符串字面量类型还可以用于区分函数重载：

```ts
function createElement(tagName: 'img'): HTMLImageElement
function createElement(tagName: 'input'): HTMLInputElement

function createElement(tagName: string): Element {}
```

**代码解释：**

如果参数 tagName 为 `'img'` 类型，返回值类型为 `HTMLImageElement`; 如果参数 tagName 为 `'input'` 类型，返回值类型为 `HTMLInputElement`。



### 布尔字面量类型

声明布尔字面量类型，注意这里是 `:` 不是 `=`。 `=` 等号是变量赋值，`:` 表示声明的类型。

```ts
let success: true
let fail: false
let value: true | false
```

接口的返回值，会有正确返回和异常两种情况，这两种情况要有不同的数据返回格式：

```ts
type Result = { success: true, code: number, object: object } | { success: false, code: number, errMsg: string }

let res: Result = { success: false, code: 90001, errMsg: '该二维码已使用' }

if (!res.success) {
  res.errMsg // OK
  res.object // Error, Property 'object' does not exist on type '{ success: false; code: number; errMsg: string; }
}
```

**代码解释：**

类型别名 Result 是一个由两个对象组成的联合类型，都有一个共同的 success 属性，这个属性的类型就是布尔字面量类型。因为涉及很多后续才会介绍的知识点，这里看不懂没关系，只需要大概了解这是布尔字面量类型的一种应用即可。



###  数字字面量类型

TypeScript 还具有数字字面量类型。

比如骰子只有六种点数：

```ts
let die: 1 | 2 | 3 | 4 | 5 | 6

die = 9 // Error
```

## TypeScript 类型推断

TypeScript 类型检查机制包含三个部分：

- 类型推断
- 类型保护
- 类型兼容性

类型推断的含义是不需要指定变量类型或函数的返回值类型，TypeScript 可以根据一些简单的规则推断其的类型。

### 基础类型推断

基础的类型推断发生在 **初始化变量，设置默认参数和决定返回值时。**

**初始化变量例子：**

```ts
let x = 3             // let x: number
let y = 'hello world' // let y: string

let z                 // let z: any
```

**代码解释：**

变量 `x` 的类型被推断为数字，变量 `y` 的类型被推断为字符串。如果定义时没有赋值，将被推断为 any 类型。

设置默认参数和决定返回值时的例子：

```ts
// 返回值推断为 number
function add(a:number, b:10) {
  return a + b
}

const obj = {
  a: 10,
  b: 'hello world'
}

obj.b = 15 // Error，Type '15' is not assignable to type 'string'
```

**代码解释：**

第 1 行，参数 b 有默认值 10，被推断为 number 类型。

第 2 行，两个 number 类型相加，函数 `add()` 返回值被推断为 number 类型。

最后一行，`obj` 的类型被推断为 `{a: number, b: string}`，所以属性 b 不能被赋值为数字。

```ts
const obj = {
  protagonist: 'Sherlock',
  gender: 'male'
}

let { protagonist } = obj
```

**代码解释：** 通过解构赋值也可以完成正确的类型推断：`let protagonist: string`。



### 最佳通用类型推断

当需要从多个元素类型推断出一个类型时，TypeScript 会尽可能推断出一个兼容所有类型的通用类型。

比如声明一个数组：

```ts
let x = [1, 'imooc', null]
```

**代码解释：** 为了推断 `x` 的类型，必须考虑所有的元素类型。这里有三种元素类型 number、string 和 null，此时数组被推断为 `let x: (string | number | null)[]` 联合类型。

> **Tip：** 是否兼容 null 类型可以通过 tsconfig.json 文件中属性 `strictNullChecks` 的值设置为 true 或 false 来决定。



### 4. 上下文类型推断

**前面两种都是根据从右向左流动进行类型推断，上下文类型推断则是从左向右的类型推断。**

例如定义一个 `Animal` 的类作为接口使用：

```ts
class Animal {
  public species: string | undefined
  public weight: number | undefined
}

const simba: Animal = {
  species: 'lion',
  speak: true  // Error, 'speak' does not exist in type 'Animal'
}
```

**代码解释：** 第 6 行，将 `Animal 类型`显示的赋值给 `变量 simba`，`Animal 类型` 没有 `speak 属性`，所以不可赋值。

## TypeScript 类型断言

本节介绍类型断言，有使用关键字 `as` 和标签 `<>` 两种方式，因后者会与`JSX` 语法冲突，建议统一使用 `as` 来进行类型断言。



TypeScript 允许你覆盖它的推断，毕竟作为开发者你比编译器更了解你写的代码。

类型断言主要用于当 TypeScript 推断出来类型并不满足你的需求，你需要手动指定一个类型。



### 关键字 as

当你把 JavaScript 代码迁移到 TypeScript 时，一个常见的问题：

```ts
const user = {}

user.nickname = 'Evan'  // Error, Property 'nickname' does not exist on type '{}'
user.admin = true       // Error, Property 'admin' does not exist on type '{}'
```

**代码解释：** 编译器推断 `const user: {}`，这是一个没有属性的对象，所以你不能对其添加属性。

此时可以使用类型断言（*as关键字*）覆盖其类型推断：

```ts
interface User {
  nickname: string,
  admin: boolean,
  groups: number[]
}

const user = {} as User

user.nickname = 'Evan' 
user.admin = true       
user.groups = [2, 6]
```

**代码解释：**

第 7 行，这里通过 `as` 关键字进行类型断言，将变量 `user` 的类型覆盖为 `User` 类型。**但是请注意，类型断言不要滥用，除非你完全明白你在干什么。**

### 非空断言 !

如果编译器不能够去除 null 或 undefined，可以使用非空断言 `!` 手动去除。

```ts
function fixed(name: string | null): string {
  function postfix(epithet: string) {
    return name!.charAt(0) + '.  the ' + epithet; // name 被断言为非空
  }
  name = name || "Bob"
  return postfix("great")
}
```

**代码解释：**

第 2 行，`postfix()` 是一个嵌套函数，因为编译器无法去除嵌套函数的 null (除非是立即调用的函数表达式)，所以 TypeScript 推断第 3 行的 `name` 可能为空。

第 5 行，而 `name = name || "Bob"` 这行代码已经明确了 `name` 不为空，所以可以直接给 name 断言为非空（第 3 行）。

### 双重断言

双重断言极少有应用场景，只需要知道有这种操作即可：

```ts
interface User {
  nickname: string,
  admin: boolean,
  group: number[]
}

const user = 'Evan' as any as User
```

**代码解释：** 最后一行，使用 as 关键字进行了两次断言，最终变量 user 被强制转化为 User 类型。



## TypeScript 类型保护

类型保护是指缩小类型的范围，在一定的块级作用域内由编译器推导其类型，提示并规避不合法的操作。



###  typeof

通过 `typeof` 运算符判断变量类型，下面看一个之前介绍函数重载时的例子：

```ts
function reverse(target: string | number) {
  if (typeof target === 'string') {
    target.toFixed(2) // Error，在这个代码块中，target 是 string 类型，没有 toFixed 方法
    return target.split('').reverse().join('')
  }
  if (typeof target === 'number') {
    target.toFixed(2) // OK
    return +[...target.toString()].reverse().join('')
  }

  target.forEach(element => {}) // Error，在这个代码块中，target 是 string 或 number 类型，没有 forEach 方法
}
```

**代码解释：**

第 2 行，通过 typeof 关键字，将这个代码块中变量 target 的类型限定为 string 类型。

第 6 行，通过 typeof 关键字，将这个代码块中变量 target 的类型限定为 number 类型。

第 11 行，因没有限定，在这个代码块中，变量 target 是 string 或 number 类型，没有 forEach 方法，所以报错。



### instanceof

instanceof 与 typeof 类似，区别在于 typeof 判断基础类型，instanceof 判断是否为某个对象的实例：

```ts
class User {
  public nickname: string | undefined
  public group: number | undefined
}

class Log {
  public count: number = 10
  public keyword: string | undefined
}

function typeGuard(arg: User | Log) {
  if (arg instanceof User) {
    arg.count = 15 // Error, User 类型无此属性
  }

  if (arg instanceof Log) {
    arg.count = 15 // OK
  }
}
```

**代码解释：**

第 12 行，通过 instanceof 关键字，将这个代码块中变量 arg 的类型限定为 User 类型。

第 16 行，通过 instanceof 关键字，将这个代码块中变量 arg 的类型限定为 Log 类型。



### in

`in` 操作符用于确定属性是否存在于某个对象上，这也是一种缩小范围的类型保护。

```ts
class User {
  public nickname: string | undefined
  public groups!: number[]
}

class Log {
  public count: number = 10
  public keyword: string | undefined
}

function typeGuard(arg: User | Log) {
  if ('nickname' in arg) {
    // (parameter) arg: User，编辑器将推断在当前块作用域 arg 为 User 类型
    arg.nickname = 'imooc'
  }

  if ('count' in arg) {
    // (parameter) arg: Log，编辑器将推断在当前块作用域 arg 为 Log 类型
    arg.count = 15
  }
}
```

**代码解释：**

第 12 行，通过 in 关键字，将这个代码块中变量 arg 的类型限定为 User 类型。

第 17 行，通过 in 关键字，将这个代码块中变量 arg 的类型限定为 Log 类型。



### 字面量类型保护

用字面量类型那一节的例子改造一下来介绍字面量类型保护：

```ts
type Success = {
  success: true,
  code: number,
  object: object
}

type Fail = {
  success: false,
  code: number,
  errMsg: string,
  request: string
}

function test(arg: Success | Fail) {
  if (arg.success === true) {
    console.log(arg.object) // OK
    console.log(arg.errMsg) // Error, Property 'errMsg' does not exist on type 'Success'
  } else {
    console.log(arg.errMsg) // OK
    console.log(arg.object) // Error, Property 'object' does not exist on type 'Fail'
  }
}
```

**代码解释：**

第 15 行，通过布尔字面量，将这个代码块中变量 arg 的类型限定为 Success 类型。

第 18 行，通过布尔字面量，将这个代码块中变量 arg 的类型限定为 Fail 类型。