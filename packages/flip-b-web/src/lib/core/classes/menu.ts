import {Base} from './base';
import {Item} from './item';

/**
 * Menu
 */
export class Menu extends Base {
  // Definitions

  /**
   * Value
   * @attribute {Object}
   */
  value: {[key: string]: Item} = {};

  /**
   * Init event handler
   */
  async onInit(): Promise<any> {
    if (typeof this._config.load === 'function') {
      const config: any = await this._config.load();
      this._config = {...this.clone(this._config), ...this.clone(config)};
    }
  }
}
