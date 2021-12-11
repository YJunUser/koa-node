import { Context } from 'koa';

interface verify {
  name: string;
  type: string;
  required: boolean;
}
const validate = async (ctx: Context, next: () => Promise<void>) => {
  Object.defineProperty(ctx, 'verifyParam', {
    writable: true,
    value: (o: verify) => {
      const { name, type, required } = o;
      const param = ctx.request.body[name] || ctx.params[name];
      if (required) {
        if (!param) {
          ctx.throw(400, `${name} must be delivery`);
        }
      }

      if (typeof param !== type) {
        ctx.throw(400, `${name} is wrong type`);
      }
    },
  });

  await next();
};

export default validate;
