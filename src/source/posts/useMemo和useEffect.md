---
title: useMemo和useEffect
date: 2021/5/15
tags: React
categories: Web前端
introduction: useMemo和useEffect何时使用，用哪个，文章有很好的例子进行说明
---

## 背景

```javascript
import React, {Fragment} from 'react'
import { useState, useMemo } from 'react'

// 产品名称列表
const nameList = ['apple', 'peer', 'banana', 'lemon']

const example = (props) => {
    // 产品名称、价格
    const [price, setPrice] = useState(0)
    const [name, setName] = useState('apple')
  
    // 假设有一个业务函数  获取产品的名字
    function getProductName() {
        console.log('getProductName触发')
        return name
    }

    return (
        <Fragment>
            <p>{name}</p>
            <p>{price}</p>
            <p>{getProductName()}</p>
            <button onClick={() => setPrice(price+1)}>价钱+1</button>
            <button onClick={() => setName(nameList[Math.random() * nameList.length << 0])}>修改名字</button>
        </Fragment>
    )
}
export default example
```

现在问几个问题：
发生下面几种情况会重新渲染界面吗（也就是`getProductName`函数会被触发）？

1. 点击价钱+1按钮？
2. 点击修改名字按钮？

很显然在进行`DOM`相关操作（如`setState`）后，都会触发`getProductName`函数，但是我们想知道这个产品的名字，产品的价格怎么变不是我们关心的，所以我们需要让这个函数只在产品名字改变的时候再触发，而不是每次重新渲染都触发。

## useEffect ?

```javascript
import React, {Fragment} from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { observer } from 'mobx-react'


const nameList = ['apple', 'peer', 'banana', 'lemon']
const Example = observer((props) => {
    const [price, setPrice] = useState(0)
    const [name, setName] = useState('apple')
    
    
    function getProductName() {
        console.log('getProductName触发')
        return name
    }
    // 只对name响应
    useEffect(() => {
        console.log('name effect 触发')
        getProductName()
    }, [name])
    
    // 只对price响应
    useEffect(() => {
        console.log('price effect 触发')
    }, [price])

    return (
        <Fragment>
            <p>{name}</p>
            <p>{price}</p>
            <p>{getProductName()}</p>
            <button onClick={() => setPrice(price+1)}>价钱+1</button>
            <button onClick={() => setName(nameList[Math.random() * nameList.length << 0])}>修改名字</button>
        </Fragment>
    )
})
export default Example
```

1. 先看看`useEffect`的工作顺序，若点击修改名字按钮会打印什么？

```javascript
    > getProductName触发 
    > name effect 触发
    > getProductName触发 
```

官方文档有说过 [当你调用 useEffect 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数](https://links.jianshu.com/go?to=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fhooks-overview.html)

所以这个顺序很好理解

- 因为修改了名字，然后`react`更改了`DOM`，触发了`getProductName`
- 随后调用了`name`的`effect`（在`dom`更新之后触发，这也是为什么叫做副作用）
- `effect`中调用了`getProductName`

若点击价钱+1按钮会打印什么？

```javascript
    > getProductName触发 
    > price effect 触发
```

我改变的是价格，还是触发了`getProductName`

稍微分析：

- 显然当我使用`setPrice`的时候，产生`DOM`操作，刷新页面`DOM`的同时也，触发了在`p`标签中的`getProductName`函数
- 然后调用副作用触发了`price`的`effect`

就如前面我所提出的问题，我们的目标是在`DOM`发生变化时，不相关的函数不需要触发（也就是这里的`getProductName`在我修改价格的时候不应该触发），而`useEffect`只能在`DOM`更新后再触发再去控制，所以这个马后炮并没有什么🐦用

## useMemo?

使用`useMemo`可以解决这个问题
 为什么`useMemo`可以解决？官方文档说过[传入 useMemo 的函数会在渲染期间执行](https://links.jianshu.com/go?to=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fhooks-reference.html%23usememo)，所以使用`useMemo`就能解决之前的问题，怎么在`DOM`改变的时候，控制某些函数不被触发。

```javascript
import React, {Fragment} from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { observer } from 'mobx-react'


const nameList = ['apple', 'peer', 'banana', 'lemon']
const Example = observer((props) => {
    const [price, setPrice] = useState(0)
    const [name, setName] = useState('apple')
    
    
    function getProductName() {
        console.log('getProductName触发')
        return name
    }
    // 只对name响应
    useEffect(() => {
        console.log('name effect 触发')
        getProductName()
    }, [name])
    
    // 只对price响应
    useEffect(() => {
        console.log('price effect 触发')
    }, [price])
  
    // memo化的getProductName函数   🧬🧬🧬
    const memo_getProductName = useMemo(() => {
        console.log('name memo 触发')
        return () => name  // 返回一个函数
    }, [name])

    return (
        <Fragment>
            <p>{name}</p>
            <p>{price}</p>
            <p>普通的name：{getProductName()}</p>
            <p>memo化的：{memo_getProductName ()}</p>
            <button onClick={() => setPrice(price+1)}>价钱+1</button>
            <button onClick={() => setName(nameList[Math.random() * nameList.length << 0])}>修改名字</button>
        </Fragment>
    )
})
export default Example
```

同样两个问题

1. 点击价钱+1按钮会发生什么



```undefined
> getProductName触发
> price effect 触发
```

- 首先`DOM`改变，触发在`p`标签中的`getProductName`函数
- 然后调用`effect`

显然我们已经成功的控制了触发（修改了显示`price`的`dom`，但是没有触发`memo_getProductName`，没有输出''name memo 触发''），
 这也是官方为什么说不能在`useMemo`中操作`DOM`之类的副作用操作，[不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo](https://links.jianshu.com/go?to=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fhooks-reference.html%23usememo)，你可以试一下，在`useMemo`中使用`setState`你会发现会产生死循环，并且会有警告，因为`useMemo`是在渲染中进行的，你在其中操作`DOM`后，又会导致`memo`触发

1. 点击修改名字按钮会发生什么



```undefined
> name memo 触发
> getProductName触发
> name effect 触发
> getProductName触发
```

- 首先`DOM`变化，触发`name`的`memo`，
- 然后触发`p`标签内的`getProductName`函数
- `DOM`操作结束后触发`name`的`effect`
- 在`name`的`effect`中触发`getProductName`

从这里也可以看出，<code>useMemo</code>是在**`DOM`更新前触**发的，<code>useEffect</code>是在<code>DOM</code>**更新后**触发的就像官方所说的

