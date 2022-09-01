import {App} from './app';

/**
 * Route
 */
export abstract class Route {
  app: App;
  name: string;
  path: string;

  /**
   * Routes
   */
  abstract routes: Routes;

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
    this.name = this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_route$/, '');
    this.path = this.app.helper.changeCase.paramCase(`${this.constructor.name}`).replace(/-route$/, '');
  }

  /**
   * Get route
   */
  getRoute(): any {
    return this;
  }
}

/**
 * Routes interface
 */
export interface Routes {
  [index: string]: any;
}
