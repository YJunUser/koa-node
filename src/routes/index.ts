import * as Router from 'koa-router';
import user from '../controllers/user';
import articles from '../controllers/articles';
import life from '../controllers/life';
const router = new Router();

router.get('/user/login', user.find);
router.get('/articles', articles.getArticles);
router.get('/articles/:path', articles.getArticleByPath);

router.get('/life', life.getLife);
router.get('/life/:path', life.getLifeByPath);

export default router;
