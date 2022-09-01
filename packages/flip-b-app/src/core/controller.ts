import {App} from './app';

/**
 * Controller
 */
export abstract class Controller {
  app: App;
  name: string;
  path: string;

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
    this.name = this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_controller$/, '');
    this.path = this.app.helper.changeCase.paramCase(`${this.constructor.name}`).replace(/-controller$/, '');
  }

  /**
   * Get controller
   */
  getController(): any {
    return this;
  }
}
