import express from 'express';

/**
 * Files handler
 */
export default function filesHandler(app: any): any {
  if (!app.config.router?.files) {
    return;
  }
  app.config.router.files.path = app.config.router.files.path || '/files';
  app.config.router.files.dest = app.config.router.files.dest || `${app.config.var}/upload/files`;
  app.config.router.files.cache = app.config.router.files.cache || '30 days';
  return getRouter(app);
}

/**
 * Get router
 */
function getRouter(app: any): any {
  const router: any = express.Router();
  router.use(`${app.config.server.path}${app.config.router.files.path}/`, getPathHandler(app));
  router.get(`${app.config.server.path}${app.config.router.files.path}/*`, getFileHandler(app));
  return router;
}

/**
 * Get path handler
 */
function getPathHandler(app: any): any {
  return express.static(`${app.config.router.files.dest}`, {dotfiles: 'deny', maxAge: `${app.config.router.files.cache}`, etag: false});
}

/**
 * Get file handler
 */
function getFileHandler(app: any): any {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.is('json')) {
      return next(new Error('#404 Not found'));
    }
    const file = `${app.config.router.files.dest}/index.html`;
    if (!app.helper.fs.existsSync(file)) {
      return next(new Error('#404 Not found'));
    }
    res.sendFile(file);
  };
}
