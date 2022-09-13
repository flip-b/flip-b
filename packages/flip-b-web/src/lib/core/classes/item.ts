import {Base} from './base';
import {Form} from './form';

/**
 * Item
 */
export class Item extends Base {
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
    const _raw: any = this.clone(this._config);
    const attributes = [
      'elementClass',
      'elementStyle',

      'name',
      'type',
      'mode',

      'text',

      'icon',
      'iconColor',
      'iconStyle',

      'drop',
      'dropColor',
      'dropStyle',

      'push',
      'pushColor',
      'pushStyle',

      'hide',
      'show',

      'iconOnly',

      'size',
      'slot', 
      'path',

      'fields',
      'values',
      'value',

      'require',
      'pattern',
      'max',
      'maxLength',
      'min',
      'minLength',
      'readonly',
      'disabled',

      'inputFormat',
      'inputType',
      'inputMode',
      'inputPicker',
      'inputAccept'
    ];

    for (const a of attributes) {
      this._config[`${a}`] = (typeof this._config[`${a}`] === 'function' ? this._config[`${a}`](this) : this._config[`${a}`]) || undefined;
    }
    for (const k in this._config) {
      if (!attributes.includes(k) && !k.match(/^on/)) {
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
    } else if (this._config.type === 'field' || ['expand', 'header', 'footer', 'button', 'submit', 'cancel'].includes(this._config.type)) {
      this._config.mode = 'field';
    } else {
      this._config.mode = 'input';
    }

    // Verify name
    if (typeof this._config.name !== 'string' || !this._config.name) {
      throw new Error('The value for option "name" is invalid.');
    }

    // Verify type
    if (
      typeof this._config.type !== 'string' ||
      ![
        'array',
        'group',
        'value',
        'field',
        'input',

        'id',
        'string',
        'number',
        'object',

        'select',
        'select_multiple',

        'unixtime',
        'datetime',
        'date',
        'time',
        'year',
        'year_month',

        'decimal',
        'integer',
        'percent',
        'currency',

        'checkbox',
        'toggle',

        'text',
        'textarea',
        'richtext',

        'location',

        'attachment',
        'image',
        'video',
        'audio',
        'url',

        'phone',
        'email',
        'color',

        'username',
        'password',
        
        'expand',
        'header',
        'footer',

        'button',
        'submit',
        'cancel'
      ].includes(this._config.type)
    ) {
      throw new Error('The value for option "type" is invalid.');
    }

    // Verify mode
    if (typeof this._config.mode !== 'string' || !['array', 'group', 'value', 'field', 'input'].includes(this._config.mode)) {
      throw new Error('The value for option "mode" is invalid.');
    }

    this._config.uuid = this._config.uuid || `${this._config.name}-${this._config.type}-${this._config.mode}-${Math.random()}`.toLowerCase();
    this._config.hide = this._config.hide || undefined;
    this._config.show = this._config.show || true;
    this._config.showContent = this._config.showContent || true;
    this._config.size = this._config.size || 100;
    this._config.slot = this._config.slot || undefined;
    this._config.text = this._config.text || {};

    this._config.iconColor = this._config.iconColor || 'medium';
    this._config.iconStyle = this._config.iconStyle || undefined;
    
    this._config.pushColor = this._config.pushColor || 'medium';
    this._config.pushStyle = this._config.pushStyle || undefined;
    
    this._config.dropColor = this._config.dropColor || 'medium';
    this._config.dropStyle = this._config.dropStyle || undefined;

    // Define path
    if (!this._config.path) {
      const parents = [];
      let current = this;
      while (current) {
        if (current._config?.name) {
          parents.push(current._config.name);
        }
        current = current._parent ? current._parent : undefined;
      }
      this._config.path = parents.reverse().join('.');
    }

    // Verify type
    switch (this._config.type) {
      // Definitions

      // Id type definitions
      case 'id': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        break;
      }

      // String type definitions
      case 'string': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        break;
      }

      // Decimal type definitions
      case 'number': {
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'decimal';
        break;
      }

      // Object type definitions
      case 'object': {
        this._config.inputFormat = this._config.inputFormat || 'object';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        break;
      }

      // Select type definitions
      case 'select': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config.inputPicker = this._config.inputPicker || 'select';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? undefined : 'search';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            $event.preventDefault();
          };
        }
        break;
      }

      // Select multiple type definitions
      case 'select_multiple': {
        this._config.inputFormat = this._config.inputFormat || 'array';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';
        this._config.inputPicker = this._config.inputPicker || 'select';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? undefined : 'search';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            $event.preventDefault();
          };
        }
        break;
      }

      // Unixtime type definitions
      case 'unixtime': {
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'date-time';
        this._config.inputPicker = this._config.inputPicker || 'datetime';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? undefined : 'calendar';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            $event.preventDefault();
          };
        }
        break;
      }

      // Datetime type definitions
      case 'datetime': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'date-time';
        this._config.inputPicker = this._config.inputPicker || 'datetime';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? undefined : 'calendar';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            $event.preventDefault();
          };
        }
        break;
      }

      // Date type definitions
      case 'date': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'date';
        this._config.inputPicker = this._config.inputPicker || 'datetime';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? undefined : 'calendar';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            $event.preventDefault();
          };
        }
        break;
      }

      // Time type definitions
      case 'time': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'time';
        this._config.inputPicker = this._config.inputPicker || 'datetime';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? undefined : 'time';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            $event.preventDefault();
          };
        }
        break;
      }

      // Year type definitions
      case 'year': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'year';
        this._config.inputPicker = this._config.inputPicker || 'datetime';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? undefined : 'calendar-clear';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            $event.preventDefault();
          };
        }
        break;
      }

      // Year month type definitions
      case 'year_month': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'month-year';
        this._config.inputPicker = this._config.inputPicker || 'datetime';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? undefined : 'calendar-clear';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            $event.preventDefault();
          };
        }
        break;
      }

      // Decimal type definitions
      case 'decimal': {
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'decimal';
        break;
      }

      // Integer type definitions
      case 'integer': {
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'numeric';
        break;
      }

      // Percent type definitions
      case 'percent': {
        this._config.inputFormat = this._config.inputFormat || 'number';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'decimal';
        break;
      }

      // Currency type definitions
      case 'currency': {
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

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? undefined : 'navigate';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            $event.preventDefault();
          };
        }
        break;
      }

      // Attachment type definitions
      case 'attachment': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';
        this._config.inputAccept = this._config.inputAccept || '*/*';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? (this.value ? 'document-attach' : undefined) : 'search';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            return await this._component.data._onItemFilesClick($event, this);
          };
        }
        break;
      }

      // Image type definitions
      case 'image': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';
        this._config.inputAccept = this._config.inputAccept || 'image/*';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? (this.value ? 'image' : undefined) : 'search';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            return await this._component.data._onItemFilesClick($event, this);
          };
        }
        break;
      }

      // Video type definitions
      case 'video': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';
        this._config.inputAccept = this._config.inputAccept || 'video/*';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? (this.value ? 'videocam' : undefined) : 'search';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            return await this._component.data._onItemFilesClick($event, this);
          };
        }
        break;
      }

      // Audio type definitions
      case 'audio': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';
        this._config.inputAccept = this._config.inputAccept || 'audio/*';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? (this.value ? 'recording' : undefined) : 'search';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            return await this._component.data._onItemFilesClick($event, this);
          };
        }
        break;
      }

      // Url type definitions
      case 'url': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'url';
        this._config.inputMode = this._config.inputMode || 'url';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? (this.value ? 'link' : undefined) : undefined;
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            return await this._component.data._onItemUrlClick($event, this);
          };
        }
        break;
      }

      // Phone type definitions
      case 'phone': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'tel';
        this._config.inputMode = this._config.inputMode || 'tel';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? (this.value ? 'call' : undefined) : undefined;
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            return await this._component.data._onItemUrlClick($event, this);
          };
        }
        break;
      }

      // Email type definitions
      case 'email': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'email';
        this._config.inputMode = this._config.inputMode || 'email';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.readonly ? (this.value ? 'mail' : undefined) : undefined;
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            return await this._component.data._onItemUrlClick($event, this);
          };
        }
        break;
      }

      // Color type definitions
      case 'color': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.iconStyle = this.value ? {color: this.value} : undefined;
            this._config.icon = this._config.icon || 'color-fill';
            this._config.drop = this._config.readonly ? undefined : this.value ? 'close-circle' : undefined;
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            return await this._component.data._onItemColorClick($event, this);
          };
        }
        break;
      }

      // Username type definitions
      case 'username': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'text';
        this._config.inputMode = this._config.inputMode || 'text';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = 'person';
          };
        }
        break;
      }

      // Password type definitions
      case 'password': {
        this._config.inputFormat = this._config.inputFormat || 'string';
        this._config.inputType = this._config.inputType || 'password';
        this._config.inputMode = this._config.inputMode || 'text';

        if (!this._config.onIconClick && !this._config.onClick) {
          this._config.onLoadValue = () => {
            this._config.icon = this._config.inputType === 'password' ? 'eye' : 'eye-off';
          };
          this._config.onIconClick = async ($event: any): Promise<any> => {
            this._config.inputType = this._config.inputType === 'password' ? 'text' : 'password';
            this._config.onLoadValue();
          };
        }
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

      // Button type definitions
      case 'button': {
        this._config.onLoadValue = () => {
          this._config.size = this._config.iconOnly ? 0 : this._config.size;
          this._config.icon = this._config.icon || undefined;
        };
        this._config._onClick = () => {
          this._config.disabled = true;
        };
        this._config.onClick_ = () => {
          this._config.disabled = false;
        };
        break;
      }

      // Submit type definitions
      case 'submit': {
        this._config.onLoadValue = () => {
          this._config.size = this._config.iconOnly ? 0 : this._config.size;
          this._config.icon = this._config.icon || (this._config.iconOnly ? 'checkmark-circle' : 'checkmark');
        };
        this._config._onClick = () => {
          this._config.disabled = true;
        };
        this._config.onClick_ = () => {
          this._config.disabled = false;
        };
        this._config.onClick = async ($event: any): Promise<any> => {
          return await this.onSubmit($event.detail.$event);
        };
        break;
      }

      // Cancel type definitions
      case 'cancel': {
        this._config.onLoadValue = () => {
          this._config.size = this._config.iconOnly ? 0 : this._config.size;
          this._config.icon = this._config.icon || (this._config.iconOnly ? 'close-circle' : 'close');
        };
        this._config._onClick = () => {
          this._config.disabled = true;
        };
        this._config.onClick_ = () => {
          this._config.disabled = false;
        };
        this._config.onClick = async ($event: any): Promise<any> => {
          return await this.onCancel($event.detail.$event);
        };
        break;
      }
    }

    // Verify mode
    switch (this._config.mode) {
      case 'input': {
        this._config.onPushClick = ($event: any) => this.setValue({});
        this._config.onDropClick = ($event: any) => this.setValue(undefined);
        break;
      }
      case 'group': {
        this._config.fields = _raw.fields || [];
        this._config.onPushClick = ($event: any) => this.setValue({});
        this._config.onDropClick = ($event: any) => this.setValue(undefined);
        this._config.onLoadValue = () => {
          this._config.drop = this._config.readonly ? undefined : this.value !== undefined ? 'close-circle' : undefined;
          this._config.push = this._config.readonly ? undefined : this.value === undefined ? 'add-circle' : undefined;
        };
        break;
      }
      case 'array': {
        this._config.fields = _raw.fields || [{..._raw, type: _raw.type.replace(/\[\]$/, ''), mode: 'input', size: 100}];
        this._config.single = _raw.fields ? false : true;
        this._config.onPushClick = ($event: any) => this.setValue({});
        this._config.onDropClick = ($event: any) => this.setValue(undefined);
        this._config.onDropIndex = ($event: any, index: number) => {
          this.value.splice(index, 1);
          if (!this.value.length) {
            this.setValue(undefined);
          }
        };
        this._config.onLoadValue = () => {
          this._config.drop = this._config.readonly ? undefined : this.value !== undefined ? 'close-circle' : undefined;
          this._config.push = this._config.readonly ? undefined : 'add-circle';
        };
        break;
      }
    }

    if (!this._config.onInput && this._config.mode === 'input') {
      this._config.onInput = async ($event: any): Promise<any> => {
        $event = $event.detail.$event;
        if (typeof $event.target !== 'undefined') {
          if (typeof $event.target.checked !== 'undefined') {
            this.setValue($event.target.checked ? true : false);
          } else {
            this.setValue($event.target.value);
          }
        }
      };
    }

    // Define richtext options
    if (this._config.type === 'richtext' || this._config.type === 'textarea') {
      this._config._richUsing = [];
      this._config._richItems = [
        {title: 'b', index: 'B', value: 'bold'},
        {title: 'i', index: 'I', value: 'italic'},
        {title: 'u', index: 'U', value: 'underline'},
        {title: 's', index: 'STRIKE', value: 'strikethrough'}
      ];
      this._config._richOnInput = ($event: any) => {
        const ws: any = window.getSelection();
        if (ws) {
          this._config._richUsing = [];
          for (let i = 0; i < ws.rangeCount; i++) {
            let $s: any = ws.getRangeAt(i).startContainer;
            let $c = 0;
            while ($s?.parentNode && !$event.currentTarget.isEqualNode($s.parentNode) && $c < 100) {
              this._config._richUsing.push($s.parentNode.nodeName);
              $s = $s.parentNode;
              $c++;
            }
          }
        }
      };
      this._config._richOnClickItem = (item: any) => {
        const i = this._config._richUsing.indexOf(item.index);
        if (i === -1) {
          this._config._richUsing.push(item.index);
        } else {
          this._config._richUsing.splice(i, 1);
        }
        document.execCommand(item.value);
      };
    }

    //if (typeof this.value === 'undefined' && values && typeof values[this._config.name] !== 'undefined') {
    //  this.value = values[`${this._config.name}`];
    //}

    if (this._config.onLoadValue) {
      this._config.onLoadValue();
    }

    // Format config
    Object.keys(this._config).forEach((k: any) => (this._config[k] === undefined ? delete this._config[k] : {}));
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
          value = form;
        } else {
          value = undefined;
        }
        break;
      }
      case 'array': {
        if (value) {
          const form = new Form({fields: this.clone(this._config.fields), values: value}, this);
          value = this.value || [];
          value.push(form);
        } else {
          value = undefined;
        }
        break;
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

    //if (this._config.require && !value) {
    //  error = 'require';
    //} else if (typeof this._config.pattern === 'string' && this._config.pattern && value && !`${value || ''}`.match(new RegExp(this._config.pattern))) {
    //  error = 'warning';
    //} else if (typeof this._config.pattern === 'object' && this._config.pattern && value && !`${value || ''}`.match(this._config.pattern)) {
    //  error = 'warning';
    //} else if (typeof this._config.min === 'number' && parseFloat(`${value || 0}`) < this._config.min) {
    //  error = 'warning';
    //} else if (typeof this._config.max === 'number' && parseFloat(`${value || 0}`) > this._config.max) {
    //  error = 'warning';
    //} else if (typeof this._config.minLength === 'number' && (value || []).length < this._config.minLength) {
    //  error = 'warning';
    //} else if (typeof this._config.maxLength === 'number' && (value || []).length > this._config.maxLength) {
    //  error = 'warning';
    //}

    this.error = error;
    this.value = value;

    if (this._config.onLoadValue) {
      this._config.onLoadValue();
    }
  }
}
