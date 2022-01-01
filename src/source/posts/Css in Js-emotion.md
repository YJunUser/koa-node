---
title: Css in Js-emotion
date: 2021/5/10
tags: CSS
introduction: style component 是一个react中写样式经常用的方法，用emotion库可以封装这种方法，我写了一点使用emotion时的心得和体验，以及用emotion如何封装一个flex布局
---

## emotion的安装

```shell
yarn add @emotion/react @emotion/styled
```



## emotion的基本使用

```react
import styled from "@emotion/styled"; // 引入emotion
import logo from "assets/logo.svg"; // 引入图片
import left from "assets/left.svg";
import right from "assets/right.svg";

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(false);
  return (
    <Container>
      <Header></Header>
      <ShadowCard>
        {isRegister ? (
          <RegisterScreen></RegisterScreen>
        ) : (
          <LoginScreen></LoginScreen>
        )}
        <Divider></Divider>
        <a onClick={() => setIsRegister(!isRegister)}>
          切换到{isRegister ? "登录" : "注册"}
        </a>
      </ShadowCard>
    </Container>
  );
};


// 每个style都是一个组件
const Header = styled.header`
  background: url(${logo}) no-repeat center;
  padding: 5rem 0;
  background-size: 8rem;
  width: 100%;
`;

const ShadowCard = styled(Card)`// 非html原生标签要用括号，比如组件库和React.component
  width: 40rem;
  min-height: 56rem;
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  text-align: center;
`;

// 原生html
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  justify-content: center;
`;
```

## emotion中使用grid和flex布局

<code>grid</code>:

```react
const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: 6rem 1fr 6rem;
  grid-template-columns: 20rem 1fr 20rem;
  grid-template-areas: "header header header" "nav main aside" "footer footer footer"

`;

// 这里value没有引号
const Header = styled.header`
  grid-area: header; 
`;
const Nav = styled.nav`
  grid-area: nav;
`;

const Main = styled.main`
  grid-area: main;
`;

const Aside = styled.aside`
  grid-area: aside;
`;

const Footer = styled.footer`
  grid-area: footer;
`;

```

<code>flex</code>:

```react
const Header = styled.header`
  grid-area: header;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;
```

<code>flex和grid使用场景?</code>

+ 1维布局用flex，二维布局用grid。
+ 从内容出发：先有一组内容（数量一般不固定），希望他们均匀分布在容器中，由内容的大小决定占据的空间--flex。
+ 从布局触发：先规划网格（数量一般固定），然后再把元素往里填充。--grid

## 用emotion封装一个flex布局

<code>style.component</code>创建出来的是是一个<code>React.component</code>对象，那么当然可以接受参数（毕竟组件实质上也只是一个函数），将<code>style</code>写成一个组件的形式，听起来很厉害

在src下的componets文件里新建一个<code>lib.tsx</code>

```typescript
import styled from "@emotion/styled";

// 封装了一个flex布局，接受三个参数(between, gap, marginBottom)
// 参数的样子是不是很像接口?
export const Row = styled.div<{
  between?: boolean;
  gap?: number | boolean;
  marginBottom?: number;
}>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: ${(props) => (props.between ? "space-between" : undefined)};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
  > * { // 这里代表所有子元素
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: ${(props) =>
      typeof props.gap === "number"
        ? props.gap + "rem"
        : props.gap
        ? "2rem"
        : undefined};
  }
`;

```

在项目中引用并使用:

```react
import { Row } from "components/lib";

const Header = styled(Row)``;

const HeaderLeft = styled(Row)``;

     <Header between={true}> // 在这里传递参数，是不是很像组件!
        <HeaderLeft gap={true}>
          <h3>logo</h3>
          <h3>我的</h3>
          <h3>项目</h3>
        </HeaderLeft>
        <HeaderRight>
          <button onClick={() => logout()}>登出</button>
        </HeaderRight>
      </Header>

```

## emotion在行内样式中使用

```react
/** @jsxRuntime classic */
/** @jsx jsx */
// 第一行表示使用旧版传统模式手动导入运行时
// 第二行表示指明下一行为运行时的导入

<Form css={{ marginBottom: "2rem" }} layout={"inline"}>
```

不是很推荐使用 css props ，可以选择使用外链 css 文件或 `@emotion/styled` 的 _styled-components_ 方案，都是很不错的选择。



## 插件

`vscode styled-components` 
