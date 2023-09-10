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
   * Self
   */
  get self(): any {
    return this;
  }
}
