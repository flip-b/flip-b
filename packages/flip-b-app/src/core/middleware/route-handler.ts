import { Request, Response, Next, Router } from '../route';

/**
 * Route handler
 */
export default function routeHandler(app: any): any {
  if (!app.config.router?.route) {
    return;
  }
  app.config.router.route.path = app.config.router.route.path || '';
  app.config.router.route.auth = app.config.router.route.auth || { controller: 'users' };

  const router: any = Router();
  router.use(`${app.config.server.path}${app.config.router.route.path}`, getAccessTokenHandler(app));
  for (const r in app.routes) {
    router.use(`${app.config.server.path}${app.config.router.route.path}`, app.routes[`${r}`]);
  }
  return router;
}

/**
 * Get access token handler
 */
function getAccessTokenHandler(app: any): any {
  return async (req: Request, res: Response, next: Next) => {
    try {
      const token: any = `${req.headers['authorization'] || ''}`.split(' ').pop();
      const body: any = { ...req.body, ...req.query, ...req.params };
      const auth: any = await app.controllers[`${app.config.router.route.auth.controller}`].getAuthorization(token, body);
      req.auth = auth || false;
      res.auth = auth || false;
      next();
    } catch (error) {
      next(new Error('#402 Invalid authorization'));
    }
  };
}
