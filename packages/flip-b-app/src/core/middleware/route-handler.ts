import express from 'express';

/**
 * Route handler
 */
export default function routeHandler(app: any): any {
  if (!app.config.router?.route) {
    return;
  }
  app.config.router.route.path = app.config.router.route.path || '';
  app.config.router.route.auth = app.config.router.route.auth || 'users.auth';
  return getRouter(app);
}

/**
 * Get router
 */
function getRouter(app: any): any {
  const router: any = express.Router();
  for (const r in app.routes) {
    for (const m in app.routes[r].routes) {
      const route: any = app.routes[r].routes[m];
      const ctx: any = {};
      ctx.name = app.helper.changeCase.camelCase(r);
      ctx.path = app.helper.changeCase.paramCase(r);
      ctx.type = app.helper.changeCase.camelCase(m);
      ctx.call = route.call?.[0] || route.call || ctx.type;
      ctx.auth = route.call?.[1] || route.auth;
      router[`${route.method}`](`${app.config.server.path}${app.config.router.route.path}/${ctx.path}${route.path}`, getPathHandler(app, ctx));
    }
  }
  return router;
}

/**
 * Get path handler
 */
function getPathHandler(app: any, ctx: any): any {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params: any = {};
      params.auth = {};
      params.body = {...req.body, ...req.query, ...req.params};
      params.info = {...ctx, req, res, next};

      // Verify authorization
      if (ctx.auth?.length) {
        const [n, c]: string[] = `${app.config.router.route.auth}`.split('.');
        const result: any = await app.controllers[`${n}`][`${c}`](params);
        if (!result || !ctx.auth.includes(result.auth || 'anonymous')) {
          return next(new Error('#401 Unauthorized'));
        }
        params.auth = result;
      }

      // Define result
      let result: any;

      // Define result
      if (typeof ctx.call === 'function') {
        result = await ctx.call(params);
      } else {
        result = await app.controllers[ctx.name][ctx.call](params);
      }

      // Verify result
      if (!result) {
        return next(new Error('#404 Not Found'));
      }

      // Verify result: headers
      if (result.headers) {
        for (const h in result.headers) {
          res.set(h, result.headers[h]);
        }
      }

      // Verify result: content pipe
      if (result.content?.pipe) {
        return req.pipe(result.content.pipe);
      }

      // Verify result: content send
      if (result.content?.send) {
        return res.send(result.content.send);
      }

      // Send result
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };
}
