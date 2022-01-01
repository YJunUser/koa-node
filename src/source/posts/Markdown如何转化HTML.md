---
title: Markdown如何转化HTML
date: 2021/1/1
tags: nodejs
categories: 服务端
introduction: 平时我们写的Markdown文件如何在网页上合理的展示呢，例如写博客是一个很常见的场景
---

## 读取Markdown文件
我们将写的markdown文件直接存储在服务器中，用nodejs去读，读取目录后用正则表达式去筛选出我们需要的数据
```typescript
const dirPath = path.join(__dirname, '../source/posts');
    const dir = fs.readdirSync(dirPath);
    const data = [];

    for (let i = 0; i < dir.length; i++) {
      const article = fs
        .readFileSync(dirPath + '/' + dir[i], {
          encoding: 'utf-8',
        })
        .toString();

      const imp = {
        title: article.match(/title:\s(.*)/)[1],
        date: article.match(/date:\s(.*)/)[1],
        tags: article.match(/tags:\s(.*)/)[1],
        introduction: article.match(/introduction:\s(.*)/)[1],
      };
      data.push(imp);
    }

    return data;
```


## Markdown转化成HTML
使用marked库，可以轻易的将markdown文档转成HTML，[Marked详细说明](https://marked.js.org/using_advanced#options)
### marked配置
```typescript
import { marked } from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const hljs = require('highlight.js');
    // const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    // return hljs.highlight(code, { language }).value;
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

export default marked;
```
其中highlight是我们对代码块高亮的配置，需要配合前端来一起使用，加入highlight后，转化的html字符串会自动加入highlight中的class，前端引入对应的css和js文件后就能添加样式

### marked转化
```typescript
public getArticleByPath(articlePath: string) {
    const dirPath = path.join(__dirname, '../source/posts');

    const article = fs
      .readFileSync(dirPath + '/' + articlePath + '.md', {
        encoding: 'utf-8',
      })
      .toString();

    return Marked.parse(article);
  }
```

## 前端展示
前端接受到后端传来的HTML字符串后，将它渲染在页面特定位置中
```typescript
function showhtml(htmlString: string) {
  var html = { __html: htmlString };
  return <div dangerouslySetInnerHTML={html}></div>;
}
```

## 添加样式
对于marked转化后的HTML，我们可以用[highlight.js](https://highlightjs.org/)高亮我们的代码块
在前端项目中
```typescript
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
```
其中css是我们引入的主题样式文件，具体的主题可以参考官方[demo](https://highlightjs.org/static/demo/)