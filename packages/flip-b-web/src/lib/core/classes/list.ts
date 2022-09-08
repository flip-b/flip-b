import {Base} from './base';
import {Form} from './form';

/**
 * List
 */
export class List extends Base {
  // Definitions

  /**
   * Error
   */
  error: any | undefined;

  /**
   * Value
   */
  value: any | undefined;

  /**
   * Setup
   */
  setup() {
    const attributes = ['elementClass', 'elementStyle', 'fields', 'values'];
    for (const a of attributes) {
      this._config[`${a}`] = (typeof this._config[`${a}`] === 'function' ? this._config[`${a}`](this) : this._config[`${a}`]) || undefined;
    }
    for (const k in this._config) {
      if (!attributes.includes(k) && !k.match(/^on/)) {
        delete this._config[`${k}`];
      }
    }

    // Verify fields
    if (typeof this._config.fields === 'undefined' || !Array.isArray(this._config.fields)) {
      throw new Error('The value for option "fields" is invalid.');
    }

    // Verify values
    if (typeof this._config.values !== 'undefined' && !Array.isArray(this._config.values)) {
      throw new Error('The value for option "values" is invalid.');
    }

    // Define values
    this.setValue(this._config.values);
  }

  /**
   * Get value
   */
  getValue(): any {
    const result: any = [];
    for (const form of this.value) {
      result.push(form.getValue());
    }
    return result;
  }

  /**
   * Set value
   */
  setValue(value: any = [], add: boolean = false) {
    if (!this.value || !add) {
      this.value = [];
    }
    for (const values of value) {
      const form: Form = new Form({fields: this.clone(this._config.fields), values}, this);
      this.value.push(form);
    }
  }
}
