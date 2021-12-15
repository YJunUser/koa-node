import { Context } from 'koa';

class UserController {
  public find(ctx: Context) {
    ctx.body = 'login';
    ctx.verifyParam({
      name: 'username',
      type: 'string',
      required: true,
    });
  }

  public create(ctx: Context) {}
  public update(ctx: Context) {}
  public delete(ctx: Context) {}
}

export default new UserController();
