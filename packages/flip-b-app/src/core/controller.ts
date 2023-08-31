import {App} from './app';

export abstract class Controller {
  app: App;

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
