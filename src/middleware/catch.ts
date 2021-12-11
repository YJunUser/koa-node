import { Context } from 'koa';

const catchError = async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    ctx.status = status;
    ctx.body = {
      message: error.message,
      status,
    };
  }
};

export default catchError;
