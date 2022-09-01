import express from 'express';

/**
 * Mount handler
 */
export default function mountHandler(app: any): any {
  if (!app.config.router?.mount) {
    return;
  }
  app.config.router.mount.path = app.config.router.mount.path || '';
  app.config.router.mount.dest = app.config.router.mount.dest || `${app.config.var}/public`;
  app.config.router.mount.cache = app.config.router.mount.cache || '30 days';
  return getRouter(app);
}

/**
 * Get router
 */
function getRouter(app: any): any {
  const router: any = express.Router();
  router.use(`${app.config.server.path}${app.config.router.mount.path}/`, getPathHandler(app));
  router.get(`${app.config.server.path}${app.config.router.mount.path}/*`, getFileHandler(app));
  return router;
}

/**
 * Get path handler
 */
function getPathHandler(app: any): any {
  return express.static(`${app.config.router.mount.dest}`, {dotfiles: 'deny', maxAge: `${app.config.router.mount.cache}`, etag: false});
}

/**
 * Get file handler
 */
function getFileHandler(app: any): any {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.is('json')) {
      return next(new Error('#404 Not found'));
    }
    const file = `${app.config.router.mount.dest}/index.html`;
    if (!app.helper.fs.existsSync(file)) {
      return next(new Error('#404 Not found'));
    }
    res.sendFile(file);
  };
}
