import {Base} from './base';
import {Form} from './form';

/**
 * List
 */
export class List extends Base {
  // Definitions

  /**
   * Value
   * @attribute {Array}
   */
  value: Form[] = [];

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
    if (typeof this._config.values !== 'undefined' && !Array.isArray(this._config.values)) {
      throw new Error('The value for option "values" is invalid.');
    }

    // Define values
    if (this._config.values?.length) {
      await this.setValue(this._config.values);
    }
  }

  /**
   * Get value
   */
  async getValue(): Promise<any> {
    const result: any = [];
    for (const form of this.value) {
      result.push(await form.getValue());
    }
    return result;
  }

  /**
   * Set value
   */
  async setValue(value: any = [], reload: boolean = false): Promise<any> {
    if (!reload) {
      this.value = [];
    }
    for (const values of value) {
      const form: Form = new Form({fields: this.clone(this._config.fields), values: this.clone(values)}, this);
      await form.onInit();
      this.value.push(form);
    }
  }
}
