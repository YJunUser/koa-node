import * as Router from 'koa-router';
import user from '../controllers/user';
import articles from '../controllers/articles';
const router = new Router();

router.get('/user/login', user.find);
router.get('/articles', articles.getArticles);
router.get('/articles/:path', articles.getArticleByPath);

export default router;
