import { marked, Renderer } from 'marked';

const renderer: Partial<Renderer> = {
  image(href, title, text) {
    return `<img data-src=${href}></img>`;
  },
};

marked.use({ renderer });
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
