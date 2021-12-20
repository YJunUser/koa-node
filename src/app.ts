import * as Koa from 'koa';
import * as BodyParser from 'koa-bodyparser';
import catchError from './middleware/catch';
import validate from './middleware/validate';
import router from './routes';
import { log } from './utils';

const app = new Koa();

app.use(async (ctx: Koa.Context, next: () => Promise<void>) => {
  log.info('--------------------');
  log.info(`url: ${ctx.url}`);
  log.info(`date: ${new Date()}`);
  log.info(`get: ${JSON.stringify(ctx.request.query)}`); // 监听get请求
  log.info(`params: ${JSON.stringify(ctx.request.body)}`); // 监听post请求
  log.info('--------------------');
  await next();
});
app.use(BodyParser());
app.use(validate);
app.use(catchError);
app.use(router.routes()).use(router.allowedMethods());

// 404
app.use(async (ctx: Koa.Context) => {
  log.error('Not Found: 404');
  ctx.throw('Not Found', 404);
});
app.listen(3000, 'localhost', () => {
  console.log('server is running at 3000');
});
