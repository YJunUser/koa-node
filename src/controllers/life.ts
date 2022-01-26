import { Context } from 'koa';
import LifeService from '../services/life';

class LifeController {
  public getLife(ctx: Context) {
    const lifes = LifeService.getAllLife();
    ctx.body = {
      data: lifes,
    };
  }

  public getLifeByPath(ctx: Context) {
    ctx.verifyParam({
      name: 'path',
      type: 'string',
      required: true,
    });
    const { path } = ctx.params;
    const life = LifeService.getLifeByPath(path);
    ctx.body = {
      data: life,
    };
  }
}

export default new LifeController();
