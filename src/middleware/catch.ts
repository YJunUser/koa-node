import { Context } from 'koa';
import { log } from '../log';

const catchError = async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    log.error(error.message);
    ctx.status = status;
    ctx.body = {
      message: error.message,
      status,
    };
  }
};

export default catchError;
