import * as fs from 'fs';
import * as path from 'path';
import Marked from '../utils/marked';

class ArticlesService {
  public getAllArticles() {
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
  }

  public getArticleByPath(articlePath: string) {
    const dirPath = path.join(__dirname, '../source/posts');

    const article = fs
      .readFileSync(dirPath + '/' + articlePath + '.md', {
        encoding: 'utf-8',
      })
      .toString();

    return Marked.parse(article);
  }
}

export default new ArticlesService();
