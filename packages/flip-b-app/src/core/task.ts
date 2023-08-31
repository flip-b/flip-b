import {App} from './app';

export abstract class Task {
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
