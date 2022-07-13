import { marked, Renderer } from 'marked';

const renderer: Partial<Renderer> = {
  image(href, title, text) {
    return `<div style="display: flex; justify-content: center; align-items: center">
    <img data-src=${href} src="/loading.gif" width="30rem" height="30rem"></img>
    </div>`;
  },
};

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

marked.use({ renderer });

export default marked;
