import {App} from './app';

export abstract class Test {
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
