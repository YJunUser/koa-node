import * as path from 'path';
import * as fs from 'fs';
import { compareTime } from '../utils';
import Marked from '../utils/marked';

class LifeService {
  public getAllLife() {
    const dirPath = path.join(__dirname, '../source/life');
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

    data.sort((a, b) => {
      if (compareTime(a.date, b.date)) return -1;
      return 1;
    });

    return data;
  }

  public getLifeByPath(articlePath: string) {
    const dirPath = path.join(__dirname, '../source/life');

    const article = fs
      .readFileSync(dirPath + '/' + articlePath + '.md', {
        encoding: 'utf-8',
      })
      .toString();

    return Marked.parse(article);
  }
}

export default new LifeService();
