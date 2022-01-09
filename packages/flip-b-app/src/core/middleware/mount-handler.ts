import { Request, Response, Next, Router, Static } from '../route';

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

  const router: any = Router();
  router.use(`${app.config.server.path}${app.config.router.mount.path}/`, getPublicPathHandler(app));
  router.get(`${app.config.server.path}${app.config.router.mount.path}/*`, getPublicFileHandler(app));
  return router;
}

/**
 * Get public path handler
 */
function getPublicPathHandler(app: any): any {
  return Static(`${app.config.router.mount.dest}`, { dotfiles: 'deny', maxAge: `${app.config.router.mount.cache}`, etag: false });
}

/**
 * Get public file handler
 */
function getPublicFileHandler(app: any): any {
  return (req: Request, res: Response, next: Next) => {
    if (req.is('json')) {
      return next(new Error('#404 Not found'));
    }
    const file = `${app.config.router.mount.dest}/index.html`;
    if (!app.helper.fs.existsSync(file)) {
      return next(new Error('#404 Not found'));
    }
    console.log(file);
    res.sendFile(file);
  };
}
