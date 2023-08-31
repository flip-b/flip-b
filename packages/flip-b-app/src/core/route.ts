import {App} from './app';

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
   * Get Self
   */
  get self(): any {
    return this;
  }
}

export interface Routes {
  [index: string]: any;
}
