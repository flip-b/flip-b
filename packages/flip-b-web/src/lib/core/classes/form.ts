import {Base} from './base';
import {Item} from './item';

/**
 * Form
 */
export class Form extends Base {
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
    const attributes = ['elementClass', 'elementStyle', 'fields', 'values'];
    const attributesEvents = ['onSetup', 'onClick', 'onEnter', 'onLeave', 'onInput', 'onChange', 'onReload', 'onSearch', 'onSelect', 'onSubmit', 'onCancel'];
    for (const a of attributes) {
      this._config[`${a}`] = (typeof this._config[`${a}`] === 'function' ? this._config[`${a}`](this) : this._config[`${a}`]) || undefined;
    }
    for (const k in this._config) {
      if (!attributes.includes(k) && !attributesEvents.includes(k)) {
        delete this._config[`${k}`];
      }
    }

    // Verify fields
    if (typeof this._config.fields === 'undefined' || !Array.isArray(this._config.fields)) {
      throw new Error('The value for option "fields" is invalid.');
    }

    // Verify values
    if (typeof this._config.values !== 'undefined' && (Array.isArray(this._config.values) || this._config.values === null)) {
      throw new Error('The value for option "values" is invalid.');
    }

    // Define value
    for (const field of this._config.fields) {
      const item = new Item(field, this);
      await item.onInit();
      this.value[`${field.name}`] = item;
    }
    if (this._config.values) {
      await this.setValue(this._config.values);
    }
  }

  /**
   * Get value
   */
  async getValue(): Promise<any> {
    const result: any = {};
    for (const field of this._config.fields) {
      const item = this.value[`${field.name}`];
      result[`${field.name}`] = await item.getValue();
    }
    return result;
  }

  /**
   * Set value
   */
  async setValue(value: any = {}): Promise<any> {
    for (const field of this._config.fields) {
      const item = this.value[`${field.name}`];
      await item.setValue(value[`${field.name}`]);
    }
  }
}
