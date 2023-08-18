import express from 'express';

/**
 * Route handler
 */
export default function routeHandler(app: any): any {
  if (!app.config.router?.route) {
    return;
  }
  app.config.router.route.path = app.config.router.route.path || '';
  app.config.router.route.auth = app.config.router.route.auth || 'users.getAuth';
  return getRouter(app);
}

/**
 * Get router
 */
function getRouter(app: any): any {
  const router: any = express.Router();
  for (const r in app.routes) {
    for (const x in app.routes[r].routes) {
      const ctx: any = {};
      ctx.name = app.routes[r].name;
      ctx.path = app.routes[r].path;
      ctx.type = x;
      ctx.current = app.routes[r].routes[x];

      const route: any = app.routes[r].routes[x];
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
      params.info = {ctx, req, res, next};

      // Verify authorization
      if (ctx.current.auth?.length) {
        const [c, m]: string[] = `${app.config.router.route.auth}`.split('.');
        const result: any = await app.controllers[`${c}`][`${m}`](params);
        if (!result) {
          return next(new Error('#402 Invalid authorization'));
        }
        if (!ctx.current.auth.includes(result.auth || 'anonymous')) {
          return next(new Error('#401 Unauthorized'));
        }
        params.auth = result;
      }

      if (!app.controllers?.[ctx.name]?.[ctx.type]) {
        console.log(ctx.name, ctx.type);
      }

      // Define result
      const result: any = await app.controllers[ctx.name][ctx.type](params);
      if (!result) {
        return next(new Error('#404 Not found'));
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
