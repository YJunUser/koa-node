---
title: React惰性初始化和如何保存函数状态
date: 2021/5/17
tags: React
categories: Web前端
introduction: 做功能时碰到的一个特殊场景，如何用react合理的保存一个函数，并改变这个函数
---

## 背景

今天在做一个功能的时候，需要用到<code>useState</code>保存一个函数，并<code>setState</code>去改变这个函数的状态，初始代码如下：

```react
import "./styles.css";
import React from "react";

export default function App() {
  const [callback, setCallback] = React.useState(() => {
    return "init";
  });
  console.log(callback);
  return (
    <div className="App">
      <button
        onClick={() =>
          setCallback(() => {
            return "update";
          })
        }
      >
        改变函数
      </button>
    </div>
  );
}
```

很快，页面崩溃了，控制台报错：

![image-20210517143331706](images/artical-image/image-20210517143331706.png)

一开始<code>init</code>就输出了一次，点<code>button</code>后<code>update</code>输出，这是为啥呢？我只是想保存函数，并不想让他执行

## 惰性初始State

为了调查上述问题，当然是去看[React官方文档](https://zh-hans.reactjs.org/docs/hooks-reference.html)，在[hooksAPI](https://zh-hans.reactjs.org/docs/hooks-reference.html)，这一节中，我发现了问题所在，惰性初始State：

#### 惰性初始 state

`initialState` 参数只会在组件的**初始渲染中**起作用，后续渲染时会被忽略。如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用：

```react
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

也就是说，给<code>useState</code>传入一个函数并不会保存函数状态，而是立即执行这个函数，并且只在初始渲染时执行，我猜测应该是为了避免一些高开销的运算，因为官方文档给的代码中函数名就是<code>someExpensiveComputation</code>。

这就解释了之前的问题，一开始我是想用<code>useState</code>保存一个函数，但这个函数立即就执行了，并且输出了<code>init</code>。

而在我后面调用<code>setState</code>去更新函数状态的时候，实际上是<code>React</code>以为你要更新那个惰性初始的<code>state</code>，于是就执行了<code>setCallback</code>，并用返回的<code>update</code>更新了callback

## 如何保存函数

那<code>state</code>该如何保存函数呢

### 方法1 额外加一个函数

既然<code>useState</code>中函数作为参数是惰性初始化的意思，那我们再返回一个函数不就好了吗？

```react
import "./styles.css";
import React from "react";

export default function App() {
  const [callback, setCallback] = React.useState(() => () => {
    alert("init");
  });
  console.log(callback);
  return (
    <div className="App">
      <button
        onClick={() =>
          setCallback(() => () => {
            alert("update");
          })
        }
      >
        改变函数
      </button>
      <button onClick={() => callback()}>执行函数</button>
    </div>
  );
}
```

当我们点击*执行函数*的时候，<code>alert</code>了一个<code>init</code>，当我们*改变函数*后再去*执行函数*，<code>alert</code>了一个<code>update</code>，实现了保存函数功能

### 方法2 useRef

当我们想保存一个东西的时候，想到<code>useRef</code>准没错

```react
import "./styles.css";
import React from "react";

export default function App() {
  const callback = React.useRef(() => {
    console.log("init");
  });
  console.log(callback);
  return (
    <div className="App">
      <button
        onClick={() => {
          callback.current = () => {
            console.log("update");
          };
        }}
      >
        改变函数
      </button>
      <button onClick={callback}>执行函数</button>
    </div>
  );
}

```

但又出现了新的问题，点击改变函数后，输出的还是<code>init</code>，这是因为<code>useRef</code>的改变并不会引起页面重新渲染。

<code>callback</code>仍然是初次渲染被赋予的函数

将代码改为如下：

```react
import "./styles.css";
import React from "react";

export default function App() {
  const callback = React.useRef(() => {
    console.log("init");
  });
  console.log(callback);
  return (
    <div className="App">
      <button
        onClick={() => {
          callback.current = () => {
            console.log("update");
          };
        }}
      >
        改变函数
      </button>
          // 将callback换成callback.current()
      <button onClick={() => callback.current()}>执行函数</button>
    </div>
  );
}

```

功能正常，完毕

