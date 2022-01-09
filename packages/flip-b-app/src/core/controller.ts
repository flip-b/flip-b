import { App } from './app';

/**
 * Controller
 */
export class Controller {
  app: App;

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
  }

  /**
   * Get controller
   */
  getController(): any {
    return this;
  }

  /**
   * Get controller name
   */
  getControllerName(): any {
    return this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_controller$/, '');
  }

  /**
   * Get controller path
   */
  getControllerPath(): any {
    return this.app.helper.changeCase.paramCase(`${this.constructor.name}`).replace(/-controller$/, '');
  }
}
