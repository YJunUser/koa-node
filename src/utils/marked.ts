import { marked, Renderer } from 'marked';

const renderer: Partial<Renderer> = {
  image(href, title, text) {
    return `<img data-src=${href} src="/loading.gif" width="100%" height="1000px"></img>`;
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
