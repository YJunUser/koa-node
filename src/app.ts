import * as Koa from 'koa';
import * as Router from 'koa-router'
import * as BodyParser from 'koa-bodyparser';
const app = new Koa();
const router = new Router();

router.get('/abc', (ctx: Koa.BaseContext) => {
  ctx.body = 'hello';
})

router.post('/user', (ctx: Koa.BaseContext) => {
  ctx.body = 'new';
})

app.use(BodyParser());
app.use(router.routes());

app.listen(3000, 'localhost', () => {
  console.log('server is running at 3000');
});