import { App } from './app';

/**
 * Task
 */
export abstract class Task {
  app: App;

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
  }

  /**
   * Get task
   */
  getTask(): any {
    return this;
  }

  /**
   * Get task name
   */
  getTaskName(): any {
    return this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_task$/, '');
  }

  /**
   * Get task path
   */
  getTaskPath(): any {
    return this.app.helper.changeCase.paramCase(`${this.constructor.name}`).replace(/-task$/, '');
  }
}
