import * as Router from 'koa-router';
import user from '../controllers/user';
import articles from '../controllers/articles';
import life from '../controllers/life';
const router = new Router();

// 登陆板块
router.get('/user/login', user.find);

// 文章板块
router.get('/articles', articles.getArticles);
router.get('/articles/:path', articles.getArticleByPath);

// 生活板块
router.get('/life', life.getLife);
router.get('/life/:path', life.getLifeByPath);

export default router;
