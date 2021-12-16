import * as Router from 'koa-router';
import user from '../controllers/user';
const router = new Router();

router.get('/user/login', user.find);

export default router;
