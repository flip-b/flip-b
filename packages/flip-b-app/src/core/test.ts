import {App} from './app';

/**
 * Test
 */
export abstract class Test {
  app: App;
  name: string;
  path: string;

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
    this.name = this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_test$/, '');
    this.path = this.app.helper.changeCase.paramCase(`${this.constructor.name}`).replace(/-test$/, '');
  }

  /**
   * Get test
   */
  getTest(): any {
    return this;
  }
}
