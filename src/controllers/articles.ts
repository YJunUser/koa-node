import { Context } from 'koa';
import ArticlesService from '../services/articles';

class ArticlesController {
  public getArticles(ctx: Context) {
    const articles = ArticlesService.getAllArticles();
    ctx.body = {
      data: articles,
    };
  }

  public getArticleByPath(ctx: Context) {
    const { path } = ctx.params;
    const article = ArticlesService.getArticleByPath(path);
    ctx.body = {
      data: article,
    };
  }
}

export default new ArticlesController();
