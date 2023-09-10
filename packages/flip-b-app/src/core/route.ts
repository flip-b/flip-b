import {App} from './app';

export abstract class Route {
  app: App;
  abstract routes: Routes;

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
  }

  /**
   * Self
   */
  get self(): any {
    return this;
  }
}

export interface Routes {
  [index: string]: any;
}
