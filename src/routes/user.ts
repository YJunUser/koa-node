import * as Router from 'koa-router';
import user from '../controllers/user';
const router = new Router({ prefix: '/user' });

router.get('/login', user.find);

export default router;
