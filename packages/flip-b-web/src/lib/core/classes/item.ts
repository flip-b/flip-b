import {Base} from './base';
import {Form} from './form';

/**
 * Item
 */
export class Item extends Base {
  // Definitions

  /**
   * Error
   * @attribute {Mixed}
   */
  error: any | undefined;

  /**
   * Value
   * @attribute {Mixed}
   */
  value: any | undefined;

  /**
   * Setup
   */
  setup() {
    const _raw: any = this.clone(this._config);
    const attributes = ['elementClass', 'elementStyle', 'name', 'type', 'mode', 'text', 'icon', 'iconDisabled', 'iconColor', 'iconStyle', 'iconOnly', 'drop', 'dropDisabled', 'dropColor', 'dropStyle', 'hide', 'size', 'case', 'mask', 'fill', 'color', 'fields', 'values', 'value', 'require', 'pattern', 'max', 'maxLength', 'min', 'minLength', 'readonly', 'inputFormat', 'inputType', 'inputMode', 'inputPicker', 'inputAccept', 'inputlocale', 'inputCase', 'inputMask'];
    const attributesEvents = ['onSetup', 'onClick', 'onEnter', 'onLeave', 'onInput', 'onChange', 'onReload', 'onSearch', 'onSelect', 'onSubmit', 'onCancel'];
    for (const a of attributes) {
      this._config[`${a}`] = (typeof this._config[`${a}`] === 'function' ? this._config[`${a}`](this) : this._config[`${a}`]) || undefined;
    }
    for (const k in this._config) {
      if (!attributes.includes(k) && !attributesEvents.includes(k)) {
        if (k !== 'slot') {
          console.log(`Delete ${k}`);
        }
        delete this._config[`${k}`];
      }
    }

    // Define type and mode
    if (!this._config.type) {
      this._config.type = 'text';
      this._config.mode = 'input';
    } else if (this._config.type === 'array' || this._config.type.match(/\[\]$/)) {
      this._config.type = this._config.type.replace(/\[\]$/, '');
      this._config.mode = 'array';
    } else if (this._config.type === 'group') {
      this._config.mode = 'group';
    } else if (this._config.type === 'value') {
      this._config.mode = 'value';
    } else if (this._config.type === 'field' || ['expand', 'header', 'footer', 'legend', 'upload', 'button', 'submit', 'cancel'].includes(this._config.type)) {
      this._config.mode = 'field';
    } else {
      this._config.mode = 'input';
    }

    // Verify name
    if (typeof this._config.name !== 'string' || !this._config.name) {
      throw new Error('The value for option "name" is invalid.');
    }

    // Verify type
    if (typeof this._config.type !== 'string' || !['array', 'group', 'value', 'field', 'input', 'id', 'object', 'select', 'select_multiple', 'unixtime', 'datetime', 'date', 'time', 'year', 'year_month', 'decimal', 'integer', 'percent', 'currency', 'checkbox', 'toggle', 'text', 'textarea', 'richtext', 'location', 'attachment', 'image', 'video', 'audio', 'url', 'phone', 'email', 'color', 'username', 'password', 'expand', 'header', 'footer', 'legend', 'upload', 'button', 'submit', 'cancel'].includes(this._config.type)) {
      throw new Error('The value for option "type" is invalid.');
    }

    // Verify mode
    if (typeof this._config.mode !== 'string' || !['array', 'group', 'value', 'field', 'input'].includes(this._config.mode)) {
      throw new Error('The value for option "mode" is invalid.');
    }

    this._config.uuid = this._config.uuid || `${this._config.name}-${this._config.type}-${this._config.mode}-${Math.random()}`; // + ('00000' + (this._config._uid++).toString().substr(-5));
    this._config.size = this._config.size || 100;

    //this.path = (parent?.path ? `${parent.path}.` : '') + `${this._config.name}`;
    //const path: any = `${this._config.name}.${this.path}`;
    //if (typeof this._config.text === 'string' && this._config.text) {
    //  this._config.text = {title: this._config.text};
    //}
    this._config.text = this._config.text || {};
    this._config.text.title = this._config.title || this._config.name;
    this._config.text.label = this._config.label || this._config.name;
    this._config.text.message = this._config.message || this._config.name;
    //this._config.text.title = this._config.text.title || this.pageService.getI18n(`${path}.title`) || '';
    //this._config.text.label = this._config.text.label || this.pageService.getI18n(`${path}.label`) || '';
    //this._config.text.message = this._config.text.message || this.pageService.getI18n(`${path}.message`) || '';
    //this._config.text.require = this._config.text.require || this.pageService.getI18n(`${path}.require`) || '';
    //this._config.text.warning = this._config.text.warning || this.pageService.getI18n(`${path}.warning`) || '';
    //this._config.text.success = this._config.text.success || this.pageService.getI18n(`${path}.success`) || '';

    // Verify
    //if (!this._config?.locale) {
    //  this._config.locale = this.pageService.getLocale();
    //}
    //if (this._config.type === 'location') {
    //  this._config.maps = this._config.maps || this.pageService.user?.config?.maps;
    //  this._config.zoom = this._config.zoom || 12;
    //}

    // Verify type
    switch (this._config.type) {
      // Definitions

      // Id type definitions
      case 'id': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'search';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Object type definitions
      case 'object': {
        this._config.inputFormat = this._config.inputFormat || 'object';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'search';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Select type definitions
      case 'select': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config.inputPicker = this._config.inputMode || 'select';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'search';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Select multiple type definitions
      case 'select_multiple': {
        this._config.inputFormat = this._config.inputFormat || 'array';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config.inputPicker = this._config.inputMode || 'select';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'search';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Unixtime type definitions
      case 'unixtime': {
        this._config.pattern = this._config.pattern || /^[0-9]+$/;
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'date-time';
        this._config.inputPicker = this._config.inputPicker || 'datetime';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'calendar';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Datetime type definitions
      case 'datetime': {
        this._config.pattern = this._config.pattern || /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.*?)/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'date-time';
        this._config.inputPicker = this._config.inputPicker || 'datetime';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'calendar';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Date type definitions
      case 'date': {
        this._config.pattern = this._config.pattern || /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'date';
        this._config.inputPicker = this._config.inputPicker || 'datetime';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'calendar';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Time type definitions
      case 'time': {
        this._config.pattern = this._config.pattern || /^[0-9]{2}:[0-9]{2}$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'time';
        this._config.inputPicker = this._config.inputPicker || 'datetime';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'time';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Year type definitions
      case 'year': {
        this._config.pattern = this._config.pattern || /^[0-9]{4}$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'year';
        this._config.inputPicker = this._config.inputPicker || 'datetime';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'calendar-clear';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Year month type definitions
      case 'year_month': {
        this._config.pattern = this._config.pattern || /^[0-9]{4}-[0-9]{2}$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'month-year';
        this._config.inputPicker = this._config.inputPicker || 'datetime';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'calendar-clear';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Decimal type definitions
      case 'decimal': {
        this._config.pattern = this._config.pattern || /^-?[0-9]{1,20}(.[0-9]{1,20})?$/;
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'decimal';
        break;
      }

      // Integer type definitions
      case 'integer': {
        this._config.pattern = this._config.pattern || /^-?[0-9]{1,20}$/;
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'numeric';
        break;
      }

      // Percent type definitions
      case 'percent': {
        this._config.pattern = this._config.pattern || /^-?[0-9]{1,20}(.[0-9]{1,20})?$/;
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'decimal';
        break;
      }

      // Currency type definitions
      case 'currency': {
        this._config.pattern = this._config.pattern || /^-?[0-9]{1,20}(.[0-9]{1,20})?$/;
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'decimal';
        break;
      }

      // Checkbox type definitions
      case 'checkbox': {
        this._config.inputFormat = this._config.inputFormat || 'boolean';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'boolean';
        this._config.inputPicker = this._config.inputPicker || 'checkbox';
        break;
      }

      // Toggle type definitions
      case 'toggle': {
        this._config.inputFormat = this._config.inputFormat || 'boolean';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'boolean';
        this._config.inputPicker = this._config.inputPicker || 'checkbox';
        break;
      }

      // Text type definitions
      case 'text': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        break;
      }

      // Textarea type definitions
      case 'textarea': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        break;
      }

      // Richtext type definitions
      case 'richtext': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'html';
        break;
      }

      // Location type definitions
      case 'location': {
        this._config.inputFormat = this._config.inputFormat || 'object';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config.inputPicker = this._config.inputPicker || 'location';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? undefined : 'navigate';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Attachment type definitions
      case 'attachment': {
        this._config.pattern = this._config.pattern || /^https?:\/\/.*$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';
        this._config.inputPicker = this._config.inputPicker || 'files';
        this._config.inputAccept = this._config.inputAccept || '*/*';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? (this.value ? 'document-attach' : undefined) : 'search';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Image type definitions
      case 'image': {
        this._config.pattern = this._config.pattern || /^https?:\/\/.*$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';
        this._config.inputPicker = this._config.inputPicker || 'files';
        this._config.inputAccept = this._config.inputAccept || 'image/*';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? (this.value ? 'image' : undefined) : 'search';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Video type definitions
      case 'video': {
        this._config.pattern = this._config.pattern || /^https?:\/\/.*$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';
        this._config.inputPicker = this._config.inputPicker || 'files';
        this._config.inputAccept = this._config.inputAccept || 'video/*';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? (this.value ? 'videocam' : undefined) : 'search';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Audio type definitions
      case 'audio': {
        this._config.pattern = this._config.pattern || /^https?:\/\/.*$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';
        this._config.inputPicker = this._config.inputPicker || 'files';
        this._config.inputAccept = this._config.inputAccept || 'audio/*';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? (this.value ? 'recording' : undefined) : 'search';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Url type definitions
      case 'url': {
        this._config.pattern = this._config.pattern || /^https?:\/\/.*$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? (this.value ? 'link' : undefined) : undefined;
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Phone type definitions
      case 'phone': {
        this._config.pattern = this._config.pattern || /^[0-9]{8,12}$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'tel';
        this._config.inputMode = this._config.inputMode || 'tel';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? (this.value ? 'call' : undefined) : undefined;
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Email type definitions
      case 'email': {
        this._config.pattern = this._config.pattern || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'email';
        this._config.inputMode = this._config.inputMode || 'email';
        this._config._onValue = () => {
          this._config.icon = this._config.readonly ? (this.value ? 'mail' : undefined) : undefined;
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Color type definitions
      case 'color': {
        this._config.pattern = this._config.pattern || /^#(?:[0-9a-f]{3}){1,2}$/;
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config.inputPicker = this._config.inputPicker || 'color';
        this._config._onValue = () => {
          this._config.iconStyle = this.value ? {color: this.value} : undefined;
          this._config.icon = this._config.icon || 'color-fill';
          this._config.drop = this._config.readonly ? undefined : (this.value ? 'close-circle' : undefined);
        };
        break;
      }

      // Username type definitions
      case 'username': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config.inputPicker = this._config.inputPicker || 'username';
        this._config._onValue = () => {
          this._config.icon = 'person';
          this._config.iconDisabled = (!this._config.onClick);
        };
        break;
      }

      // Password type definitions
      case 'password': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'password';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config.inputPicker = this._config.inputPicker || 'password';
        this._config._onValue = () => {
          this._config.icon = 'eye';
        };
        this._config._onClick = () => {
          this._config.icon = this._config.inputType === 'password' ? 'eye-off' : 'eye';
          this._config.inputType = this._config.inputType === 'password' ? 'text' : 'password';
        };
        break;
      }

      // Header type definitions
      case 'expand': {
        this._config.size = 0;
        break;
      }

      // Header type definitions
      case 'header': {
        break;
      }

      // Footer type definitions
      case 'footer': {
        break;
      }

      // Legend type definitions
      case 'legend': {
        break;
      }

      // Upload type definitions
      case 'upload': {
        break;
      }

      // Button type definitions
      case 'button': {
        this._config._onValue = () => {
          this._config.size = this._config.iconOnly ? 0 : this._config.size;
          this._config.icon = this._config.icon || undefined;
          this._config.fill = this._config.fill || (this._config.iconOnly ? 'clear' : 'solid');
          this._config.color = this._config.color || (this._config.iconOnly ? 'medium' : 'light');
        };
        break;
      }

      // Submit type definitions
      case 'submit': {
        this._config._onValue = () => {
          this._config.size = this._config.iconOnly ? 0 : this._config.size;
          this._config.icon = this._config.icon || (this._config.iconOnly ? 'checkmark-circle' : 'checkmark');
          this._config.fill = this._config.fill || (this._config.iconOnly ? 'clear' : 'solid');
          this._config.color = this._config.color || (this._config.iconOnly ? 'medium' : 'light');
        };
        this._config._onClick = async ($event: any): Promise<any> => {
          return await this.onSubmit($event.detail.$event);
        };
        break;
      }

      // Cancel type definitions
      case 'cancel': {
        this._config._onValue = () => {
          this._config.size = this._config.iconOnly ? 0 : this._config.size;
          this._config.icon = this._config.icon || (this._config.iconOnly ? 'close-circle' : 'close');
          this._config.fill = this._config.fill || (this._config.iconOnly ? 'clear' : 'solid');
          this._config.color = this._config.color || (this._config.iconOnly ? 'medium' : 'light');
        };
        this._config._onClick = async ($event: any): Promise<any> => {
          return await this.onCancel($event.detail.$event);
        };
        break;
      }
    };

    // Verify mode
    switch (this._config.mode) {
      // Definitions

      // Array mode definitions
      case 'array': {
        this._config.fields = _raw.fields || [{..._raw, type: _raw.type.replace(/\[\]$/, ''), mode: 'input', size: 100}];
        this._config.single = _raw.fields ? false : true;
        this._config.inputArrayPush = async (value: any = {}): Promise<any> => {
          this.setValue(value);
        };
        this._config.inputArrayDrop = async (): Promise<any> => {
          this.setValue(undefined);
        };
        this._config.inputArrayDropByIndex = async (index: number): Promise<any> => {
          this.value.splice(index, 1);
        };
        break;
      }

      // Group mode definitions
      case 'group': {
        this._config.fields = _raw.fields || [];
        this._config.inputGroupPush = async (value: any = {}): Promise<any> => {
          this.setValue(value);
        };
        this._config.inputGroupDrop = async (): Promise<any> => {
          this.setValue(undefined);
        };
        break;
      }
    }

    if (!this._config.onInput && this._config.mode === 'input') {
      this._config.onInput = async ($event: any): Promise<any> => {
        $event = $event.detail.$event;
        if (typeof $event.target !== 'undefined') {
          if (typeof $event.target.checked !== 'undefined') {
            await this.setValue($event.target.checked ? true : false);
          } else {
            await this.setValue($event.target.value);
          }
        }
      };
    }

    //if (typeof this.value === 'undefined' && values && typeof values[this._config.name] !== 'undefined') {
    //  this.value = values[`${this._config.name}`];
    //}

    // Verify result
    if (this._config._onValue) {
      this._config._onValue();
    }

    //Object.keys(this._config).forEach((k: any) => this._config[k] === undefined ? delete this._config[k] : {});
  }

  /**
   * Get value
   */
  getValue(): any {
    let result: any;
    switch (this._config.mode) {
      case 'input': {
        result = this.value || undefined;
        break;
      }
      case 'group': {
        result = this.value ? this.value.getValue() : undefined;
        break;
      }
      case 'array': {
        result = [];
        for (const form of this.value || []) {
          result.push(this._config.single ? form.value[`${this._config.name}`].getValue() : form.getValue());
        }
        break;
      }
    }
    return result;
  }

  /**
   * Set value
   */
  setValue(value: any = undefined, error: any = undefined) {
    switch (this._config.mode) {
      case 'input': {
        value = value || undefined;
        break;
      }
      case 'group': {
        if (value) {
          const form = new Form({fields: this.clone(this._config.fields), values: value}, this);
          this.value = form;
        } else {
          this.value = undefined;
        }
        return;
      }
      case 'array': {
        if (value) {
          const form = new Form({fields: this.clone(this._config.fields), values: value}, this);
          this.value = this.value || [];
          this.value.push(form);
        } else {
          this.value = undefined;
        }
        return;
      }
    }

    // case 'unixtime': {
    // this.mask = 'DD/MM/YYYY HH:mm:ss';

    // case 'datetime': {
    // this.mask = 'DD/MM/YYYY HH:mm:ss';

    // case 'date': {
    // this.mask = 'DD/MM/YYYY';

    // case 'time': {
    // this.mask = 'HH:mm:ss';

    // case 'year': {
    // this.mask = 'YYYY';

    // case 'year_month': {
    // this.mask = 'MM/YYYY';


    //if (this._config.inputMask) {
    //  // D: Day
    //  // M: Month
    //  // Y: Year
    //  // H: Hour
    //  // m: Minute
    //  // s: Second
    //
    //  // DD/MM/YYYY HH:mm:ss -> YYYY-MM-DDTHH:mm:ssTZD'
    //  // DD/MM/YYYY -> YYYY-MM-DD
    //  // HH:mm
    //  // YYYY
    //  // MM/YYYY -> YYYY-MM
    //  // 00.000.000~
    //
    //  let mask: any = this._config.inputMask;
    //  mask = mask.replace(/TZD$/g, '');
    //  mask = mask.replace(/D/g, '0');
    //  mask = mask.replace(/M/g, '0');
    //  mask = mask.replace(/Y/g, '0');
    //  mask = mask.replace(/H/g, '0');
    //  mask = mask.replace(/m/g, '0');
    //  mask = mask.replace(/s/g, '0');
    //
    //  let text: any = $event.target.value || '';
    //  text = text.replace(/[ : ;  . , - _ @ \ / ]/g, '');
    //
    //  let list: any = [];
    //  for (let i = 0; i < text.length; i++) {
    //    if (list.length < mask.length && !['0', '~'].includes(mask[list.length])) {
    //      list.push(mask[list.length]);
    //    }
    //    if (list.length < mask.length) {
    //      list.push(text[i]);
    //    }
    //  }
    //  $event.target.value = list.join('');
    //}

    //if (this._config.mode === 'input') {
    //  item.setValue(undefined);
    //} else if (item.mode === 'group') {
    //  const value: any = new Form({fields: this._config.fields[i].fields});
    //  item.setValue(value);
    //} else if (item.mode === 'array') {
    //  const value: any = new Form({fields: this._config.fields[i].fields || [{..._config.fields[i], type: this._config.fields[i].type.replace(/\[\]$/, undefined), mode: 'input', size: 100}] });
    //  item.setValue([value]);
    //}

    //case 'unixtime': {
    //this.value = value; ? new Date(value).getTime() : undefined;

    //case 'datetime': {
    //this.value = value; ? value.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$1-$2-$3T$4:$5:$6$7') : '';

    //case 'date': {
    //this.value = value; ? value.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$1-$2-$3') : '';

    //case 'time': {
    //this.value = value; ? value.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$4:$5') : '';

    //case 'year': {
    //this.value = `${value || ''}`.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$1');

    //case 'year_month': {
    //this.value = `${value || ''}`.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$1-$2');

    //case 'decimal': {
    //this.value = parseFloat(`${value || '0'}`);

    if (this._config.require && !value) {
      error = 'require';
    } else if (typeof this._config.pattern === 'string' && this._config.pattern && value && !`${value || ''}`.match(new RegExp(this._config.pattern))) {
      error = 'warning';
    } else if (typeof this._config.pattern === 'object' && this._config.pattern && value && !`${value || ''}`.match(this._config.pattern)) {
      error = 'warning';
    } else if (typeof this._config.min === 'number' && parseFloat(`${value || 0}`) < this._config.min) {
      error = 'warning';
    } else if (typeof this._config.max === 'number' && parseFloat(`${value || 0}`) > this._config.max) {
      error = 'warning';
    } else if (typeof this._config.minLength === 'number' && (value || []).length < this._config.minLength) {
      error = 'warning';
    } else if (typeof this._config.maxLength === 'number' && (value || []).length > this._config.maxLength) {
      error = 'warning';
    }

    this.error = error;
    this.value = value;

    if (typeof this._config._onValue === 'function') {
      this._config._onValue();
    }
  }
}
