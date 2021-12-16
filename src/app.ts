import * as Koa from 'koa';
import * as BodyParser from 'koa-bodyparser';
import catchError from './middleware/catch';
import validate from './middleware/validate';
import router from './routes';
const app = new Koa();

app.use(BodyParser());
app.use(validate);
app.use(catchError);
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, 'localhost', () => {
  console.log('server is running at 3000');
});
