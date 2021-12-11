import * as Koa from 'koa';
import * as BodyParser from 'koa-bodyparser';
import catchError from './middleware/catch';
import validate from './middleware/validate';
import Routing from './routes';
const app = new Koa();

app.use(BodyParser());
app.use(validate);
app.use(catchError);
Routing(app);

app.listen(3000, 'localhost', () => {
  console.log('server is running at 3000');
});
