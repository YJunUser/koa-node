import { Context } from 'koa';
import ArticlesService from '../services/articles';

class ArticlesController {
  public getArticles(ctx: Context) {
    const articles = ArticlesService.getAllArticles();
    ctx.body = {
      data: articles,
    };
  }
}

export default new ArticlesController();
