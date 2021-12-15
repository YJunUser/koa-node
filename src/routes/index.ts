import * as fs from 'fs';
import * as Koa from 'koa';

const Routing = (app: Koa) => {
  fs.readdirSync(__dirname).forEach(async (file) => {
    if (file === 'index.ts') {
      return;
    }
    const router = await import(`./${file}`);
    app.use(router.default.routes()).use(router.default.allowedMethods());
  });
};

export default Routing;
