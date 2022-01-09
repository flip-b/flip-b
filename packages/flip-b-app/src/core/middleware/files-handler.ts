import { Request, Response, Next, Router, Static } from '../route';

/**
 * Files handler
 */
export default function filesHandler(app: any): any {
  if (!app.config.router?.files) {
    return;
  }
  app.config.router.files.path = app.config.router.files.path || '';
  app.config.router.files.dest = app.config.router.files.dest || `${app.config.var}/upload`;
  app.config.router.files.mount = app.config.router.files.mount || `/files`;
  app.config.router.files.cache = app.config.router.files.cache || '30 days';
  app.config.router.files.limit = app.config.router.files.limit || 1024 * 1024 * 2;

  const router: any = Router();
  router.post(`${app.config.server.path}${app.config.router.files.path}`, getUploadHandler(app));
  router.use(`${app.config.server.path}${app.config.router.files.mount}/`, getPublicPathHandler(app));
  router.get(`${app.config.server.path}${app.config.router.files.mount}/*`, getPublicFileHandler(app));
  return router;
}

/**
 * Get public path handler
 */
function getPublicPathHandler(app: any): any {
  return Static(`${app.config.router.files.dest}`, { dotfiles: 'deny', maxAge: `${app.config.router.files.cache}`, etag: false });
}

/**
 * Get public file handler
 */
function getPublicFileHandler(app: any): any {
  return (req: Request, res: Response, next: Next) => {
    try {
      if (app.config.env == 'development') {
        console.log(req.auth, res.auth);
      }
      const image: any = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mP8/58BAzAOZUEA5OUT9xiCXfgAAAAASUVORK5CYII=', 'base64');
      res.set('Content-Type', 'image/png');
      res.set('Content-Length', image.length);
      res.end(image);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Get upload handler
 */
function getUploadHandler(app: any): any {
  const upload: any = app.helper
    .multer({
      storage: app.helper.multer.diskStorage({
        destination: `${app.config.router.files.dest}`,
        filename: async (req: Request, file: any, cb: any) => {
          const code = `${req.get('host')} ${Date.now()} ${Math.round(Math.random() * 1e9)}`;
          const name = app.helper.crypto.createHash('md5').update(code).digest('hex') + '.' + app.helper.mimeTypes.extension(file.mimetype);
          cb(null, name);
        }
      }),
      limits: { fileSize: app.config.router.files.limit }
    })
    .single('upload');

  // Return handler
  return (req: Request, res: Response, next: Next) => {
    try {
      if (!req.auth) {
        throw new Error('#401 Unauthorized');
      }
      upload(req, res, (error: any) => {
        if (error) {
          return next(error);
        }
        res.send({ url: `${req.protocol}://${req.get('host')}${app.config.server.path}${app.config.router.files.mount}/${req.file.filename}` });
      });
    } catch (error) {
      next(error);
    }
  };
}
