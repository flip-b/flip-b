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
      // Define parameters
      const params: any = {};
      params.auth = {};
      params.body = {...req.body, ...req.query, ...req.params};
      params.info = {ctx, req, res, next};

      // Auth
      if (ctx.current.auth?.length) {
        const [c, m]: string[] = `${app.config.router.route.auth}`.split('.');
        const result: any = await app.controllers[`${c}`][`${m}`](params);
        if (!result) {
          return next(new Error('#402 Invalid authorization'));
        }
        if (!ctx.current.auth.includes(result.role || 'anonymous')) {
          return next(new Error('#401 Unauthorized'));
        }
        params.auth = result;
      }

      // Data
      if (typeof ctx.current.handler === 'string' && ctx.current.handler.match(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_]+$/)) {
        const [c, m]: string[] = ctx.current.handler.split('.');
        const result: any = await app.controllers[`${c}`][`${m}`](params);
        if (!result) {
          return next(new Error('#404 Not found'));
        }
        if (!result.headers && !result.content) {
          return res.send(result);
        }
        for (const h in result.headers) {
          res.set(h, result.headers[h]);
        }
        return res.send(result.content);
      }

      // File upload
      if (typeof ctx.current.handler === 'string' && ctx.current.handler.match(/^upload$/)) {
        const result: any = {};
        const busboy = app.helper.busboy({headers: req.headers});
        busboy.on('file', (_name: any, file: any, info: any) => {
          result.name = app.helper.crypto
            .createHash('md5')
            .update(`${Math.round(Math.random() * 1e9)}`)
            .digest('hex');
          result.extension = app.helper.mimeTypes.extension(info.mimeType);
          result.filename = info.filename;
          result.encoding = info.encoding;
          result.mimeType = info.mimeType;
          result.url = `${req.protocol}://${req.get('host')}${app.config.server.path}${app.config.router.files.path}/${result.name}.${result.extension}`;
          file.pipe(app.helper.fs.createWriteStream(`${app.config.router.files.dest}/${result.name}.${result.extension}`));
        });
        busboy.on('close', () => {
          res.set('Connection', 'close');
          res.send(result);
        });
        return req.pipe(busboy);
      }
    } catch (error) {
      next(error);
    }
  };
}
