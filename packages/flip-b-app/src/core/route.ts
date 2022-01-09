import { App } from './app';
import express from 'express';

/**
 * Route
 */
export abstract class Route {
  app: App;

  /**
   * Routes
   */
  abstract routes: Routes;

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
  }

  /**
   * Get route
   */
  getRoute(): any {
    return this.getRouter();
  }

  /**
   * Get route name
   */
  getRouteName(): any {
    return this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_route$/, '');
  }

  /**
   * Get route path
   */
  getRoutePath(): any {
    return this.app.helper.changeCase.paramCase(`${this.constructor.name}`).replace(/-route$/, '');
  }

  /**
   * Get router
   */
  private getRouter(): any {
    const router: any = express.Router();
    for (const r in this.routes) {
      const route: any = this.routes[`${r}`];
      router[`${route.method}`](`/${this.getRoutePath()}${route.path}`, this.getPathHandler(route));
    }
    return router;
  }

  /**
   * Get path handler
   */
  private getPathHandler(route: any): any {
    const [c, m]: string[] = route.handler.split('.');
    return async (req: Request, res: Response, next: Next) => {
      try {
        if (!route.auth?.includes(req.auth?.access || 'anonymous')) {
          return next(new Error('#401 Invalid access'));
        }
        const body: any = { ...req.body, ...req.query, ...req.params };
        const auth: any = { ...req.auth };
        const result: any = await this.app.controllers[`${c}`][`${m}`](body, auth);
        if (!result) {
          return next(new Error('#404 Not found'));
        }
        if (!result.headers && !result.content) {
          return res.send(result);
        }
        for (const h in result.headers) {
          res.set(h, result.headers[h]);
        }
        res.send(result.content);
      } catch (error) {
        next(error);
      }
    };
  }
}

export interface Routes {
  [index: string]: any;
}

export interface Request extends express.Request {
  auth: any;
  file: any;
}

export interface Response extends express.Response {
  auth: any;
  file: any;
}

export type Next = express.NextFunction;
export type RequestHandler = express.RequestHandler;
export type ErrorRequestHandler = express.ErrorRequestHandler;
export const Router: any = express.Router;
export const Static: any = express.static;
