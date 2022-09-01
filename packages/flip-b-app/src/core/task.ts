import {App} from './app';

/**
 * Task
 */
export abstract class Task {
  app: App;
  name: string;
  path: string;

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
    this.name = this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_task$/, '');
    this.path = this.app.helper.changeCase.paramCase(`${this.constructor.name}`).replace(/-task$/, '');
  }

  /**
   * Get task
   */
  getTask(): any {
    return this;
  }
}
