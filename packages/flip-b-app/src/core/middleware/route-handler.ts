import express from 'express';
import {camelCase, paramCase} from 'change-case';

export default function routeHandler(app: any): any {
  if (!app.config.router?.route) {
    return;
  }
  app.config.router.route.path = app.config.router.route.path || '/api/v1';
  app.config.router.route.auth = app.config.router.route.auth || {type: 'auth', name: 'users'};
  app.router.use(getRouter(app));
}

function getRouter(app: any): any {
  const router: any = express.Router();
  for (const r in app.routes) {
    for (const m in app.routes[r].routes) {
      const route: any = app.routes[r].routes[m];
      const ctx: any = {};
      ctx.name = camelCase(r);
      ctx.type = camelCase(m);
      ctx.method = `${route.method || 'get'}`.trim().toLowerCase();
      ctx.path = `${app.config.server.path}${app.config.router.route.path}/${paramCase(ctx.name)}${route.path}`;
      ctx.auth = route.auth;
      ctx.call = route.call;
      router[ctx.method](ctx.path, getHandle(app, ctx));
    }
  }
  return router;
}

function getHandle(app: any, ctx: any): any {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params: any = {};
      params.auth = {};
      params.body = {...req.body, ...req.query, ...req.params};
      params.info = {name: ctx.name, type: ctx.type};
      params.meta = {ctx, req, res, next};

      // Verify access
      if (ctx.auth?.length) {
        //const handle = app.config.router.route.auth;
        //const result: any = await app.controllers[handle.name][handle.type](params);

        const result: any = await app.controllers.users.handle({
          auth: {},
          body: {auth: true},
          info: {name: ctx.name, type: 'access'},
          meta: {ctx, req, res, next}
        });
        if (!result || !ctx.auth.includes(result.auth || 'anonymous')) {
          throw new Error('#401 Unauthorized');
        }
        params.auth = result;
      }

      // Define result
      let result: any;
      if (ctx.call === undefined) {
        result = undefined;
      } else if (typeof ctx.call === 'function') {
        result = await ctx.call(params);
      } else if (typeof ctx.call === 'object') {
        result = ctx.call;
      } else if (typeof ctx.call === 'string') {
        result = ctx.call;
      }

      // Define result from type
      if (result === undefined && app.controllers[params.info.name]?.[params.info.type]) {
        params.info.call = params.info.type;
        params.info.type = 'handle';
        result = await app.controllers[params.info.name][params.info.call](params);
      }

      // Define result from type
      if (result === undefined && app.controllers[params.info.name]?.['handle']) {
        params.info.call = params.info.type;
        params.info.type = 'handle';
        result = await app.controllers[params.info.name][params.info.type](params);
      }

      // Verify result
      if (result === undefined) {
        throw new Error('#404 Not Found');
      }

      // Verify result status code
      if (res.statusCode < 100) {
        res.status(100);
      } else if (res.statusCode === 200 && ctx.method === 'post') {
        res.status(201);
      } else if (res.statusCode === 200 && ctx.method === 'delete') {
        res.status(204);
      }

      if (result.headers) {
        for (const h in result.headers) {
          res.set(h, result.headers[h]);
        }
      }
      if (result.content?.pipe) {
        return req.pipe(result.content.pipe);
      }
      if (result.content?.send) {
        return res.send(result.content.send);
      }
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };
}
