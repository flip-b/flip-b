import {Base} from './base';
import {List} from './list';

/**
 * Page
 */
export class Page extends Base {
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
    const attributes = ['elementClass', 'elementStyle', 'name', 'type', 'mode', 'text', 'path', 'form', 'params'];
    for (const a of attributes) {
      this._config[`${a}`] = (typeof this._config[`${a}`] === 'function' ? this._config[`${a}`](this) : this._config[`${a}`]) || undefined;
    }
    for (const k in this._config) {
      if (!attributes.includes(k) && !k.match(/^on/)) {
        delete this._config[`${k}`];
      }
    }

    // Verify name
    if (typeof this._config.name !== 'string' || !this._config.name) {
      throw new Error('The value for option "name" is invalid.');
    }
    if (typeof this._config.type === 'undefined') {
      this._config.type = this._config.name.split('.')[0];
    }
    if (typeof this._config.mode === 'undefined') {
      this._config.mode = this._config.name.split('.')[1];
    }
    if (typeof this._config.mode !== 'string' || !['search', 'select', 'create', 'update', 'delete', 'export', 'import', 'submit', 'viewer'].includes(this._config.mode)) {
      this._config.mode = 'submit';
    }
    if (typeof this._config.path === 'undefined') {
      this._config.path = this._config.name.split('.')[0];
    }

    this._config.form = this._config.form || {};
    this._config.show = this._config.show || ['flip'];

    this._config.showFilter = this._config.showFilter ? true : false;
    this._config.showMetric = this._config.showMetric ? true : false;
    this._config.showFields = this._config.showFields ? true : false;

    // Define flip values
    if (this._config.show.includes('flip')) {
      if (this._config.mode === 'search') {
        this._config.showFields = false;
      } else if (this._config.mode === 'select') {
        this._config.showFields = true;
      } else if (this._config.mode === 'submit') {
        this._config.showFields = true;
      } else {
        this._config.showFields = true;
      }
    }

    /**
     *
     * Header
     *
     */

    // Define slots
    const check: any = [];
    if (this._config.form?.fields?.length) {
      this._config.form.fields.map((v: any) => check.push(this.clone(v)));
    }
    const slots: any = this.getSlotsFromItems(check);

    this._config._setHeader = (value: any = []): any => {
      const result: any = [];
      for (const v of value) {
        result.push({testi: this.getValueFromSlots(slots, v)});
      }
      this._parent.header.setValue(result);
    };

    this._config._setResult = (value: any = []): any => {
      const result: any = [];
      for (const v of value) {
        result.push({testi: this.getValueFromSlots(slots, v)});
      }
      this._parent.result.setValue(result);
    };

    this._config._setResultValue = (value: any = []): any => {
      this._parent.result.setValue(value);
    };

    // Verify mode
    switch (this._config.mode) {
      // Definitions

      // Search
      case 'search': {
        this._config.form.header = [];
        this._config.form.header.push({name: 'testi', type: 'value'});
        this._config.form.footer = [];
        this._config.form.navbar = [];
        this._config.form.navbar.push({name: 'filter', type: 'button', icon: 'filter-circle'});
        this._config.form.navbar.push({name: 'metric', type: 'button', icon: 'stop-circle'});
        this._config.form.navbar.push({name: 'expand', type: 'expand'});
        this._config.form.navbar.push({name: 'export', type: 'button', icon: 'cloud-download'});
        this._config.form.navbar.push({name: 'import', type: 'button', icon: 'cloud-upload'});
        this._config.form.navbar.push({name: 'create', type: 'button', icon: 'add-circle'});
        this._config._onInit = async ($event: any): Promise<any> => {
          return await this._component.data._onPageSearch($event, this);
        };
        this._config._onSelect = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/select/${$event.detail.item.value.value._id}`);
        };
        this._config._onScroll = ($event: any) => {
          const $el = this._component._element.nativeElement;
          const pos: number = $el.scrollTop + $el.offsetHeight;
          const max: number = $el.scrollHeight;
          if (pos > 0 && pos >= max && !this._config.searching) {
            console.log('Call infinity scroll', pos, max, {$event});
          }
        };
        break;
      }

      // Select
      case 'select': {
        this._config.form.header = [];
        this._config.form.header.push({name: 'testi', type: 'value'});
        this._config.form.footer = [];
        this._config.form.navbar = [];
        this._config.form.navbar.push({name: 'download', type: 'button', icon: 'cloud-download'});
        this._config.form.navbar.push({name: 'print', type: 'button', icon: 'print'});
        this._config.form.navbar.push({name: 'share', type: 'button', icon: 'share-social'});
        this._config.form.navbar.push({name: 'sendmail', type: 'button', icon: 'mail'});
        this._config.form.navbar.push({name: 'expand', type: 'expand'});
        this._config.form.navbar.push({name: 'delete', type: 'button', icon: 'trash'});
        this._config.form.navbar.push({name: 'update', type: 'button', icon: 'create'});
        this._config.form.navbar.push({name: 'cancel', type: 'cancel', iconOnly: true});
        this._config.form.fields = this.clone(this._config.form.fields);
        this._config.form.fields.map((v: any) => {
          v.readonly = true;
        });
        this._config._onInit = async ($event: any): Promise<any> => {
          return await this._component.data._onPageSelect($event, this);
        };
        this._config._onSubmit = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        this._config._onCancel = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        break;
      }

      // Create
      case 'create': {
        this._config.form.header = [];
        this._config.form.header.push({name: 'testi', type: 'value'});
        this._config.form.footer = [];
        this._config.form.footer.push({name: 'submit', type: 'submit', size: 50});
        this._config.form.footer.push({name: 'cancel', type: 'cancel', size: 50});
        this._config.form.navbar = [];
        this._config.form.navbar.push({name: 'expand', type: 'expand'});
        this._config.form.navbar.push({name: 'cancel', type: 'cancel', iconOnly: true});
        this._config._onInit = async ($event: any): Promise<any> => {
          this.setValue([{}]);
        };
        this._config._onSubmit = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        this._config._onCancel = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        break;
      }

      // Update
      case 'update': {
        this._config.form.header = [];
        this._config.form.header.push({name: 'testi', type: 'value'});
        this._config.form.footer = [];
        this._config.form.footer.push({name: 'submit', type: 'submit', size: 50});
        this._config.form.footer.push({name: 'cancel', type: 'cancel', size: 50});
        this._config.form.navbar = [];
        this._config.form.navbar.push({name: 'expand', type: 'expand'});
        this._config.form.navbar.push({name: 'cancel', type: 'cancel', iconOnly: true});
        this._config._onInit = async ($event: any): Promise<any> => {
          return await this._component.data._onPageSelect($event, this);
        };
        this._config._onSubmit = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        this._config._onCancel = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        break;
      }

      // Delete
      case 'delete': {
        this._config.form.header = [];
        this._config.form.header.push({name: 'testi', type: 'value'});
        this._config.form.footer = [];
        this._config.form.footer.push({name: 'submit', type: 'submit', size: 50});
        this._config.form.footer.push({name: 'cancel', type: 'cancel', size: 50});
        this._config.form.navbar = [];
        this._config.form.navbar.push({name: 'expand', type: 'expand'});
        this._config.form.navbar.push({name: 'cancel', type: 'cancel', iconOnly: true});
        this._config.form.fields = this.clone(this._config.form.fields);
        this._config.form.fields.map((v: any) => {
          v.readonly = true;
        });
        this._config._onInit = async ($event: any): Promise<any> => {
          return await this._component.data._onPageSelect($event, this);
        };
        this._config._onSubmit = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        this._config._onCancel = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        break;
      }

      // Export
      case 'export': {
        this._config.form.header = [];
        this._config.form.header.push({name: 'testi', type: 'value'});
        this._config.form.footer = [];
        this._config.form.footer.push({name: 'submit', type: 'submit', size: 50});
        this._config.form.footer.push({name: 'cancel', type: 'cancel', size: 50});
        this._config.form.navbar = [];
        this._config.form.navbar.push({name: 'expand', type: 'expand'});
        this._config.form.navbar.push({name: 'cancel', type: 'cancel', iconOnly: true});
        this._config.form.fields = [];
        this._config.form.fields.push({name: 'format', type: 'select', default: 'xlsx', data: ['xlsx', 'ods,', 'csv', 'html'], require: true});
        this._config.form.fields.push({name: 'fields', type: 'select_multiple'});
        this._config.form.fields.push({name: 'upload', type: 'attachment'});
        this._config._onInit = async ($event: any): Promise<any> => {
          this.setValue([{}]);
        };
        this._config._onSubmit = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        this._config._onCancel = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        break;
      }

      // Import
      case 'import': {
        this._config.form.header = [];
        this._config.form.header.push({name: 'testi', type: 'value'});
        this._config.form.footer = [];
        this._config.form.footer.push({name: 'submit', type: 'submit', size: 50});
        this._config.form.footer.push({name: 'cancel', type: 'cancel', size: 50});
        this._config.form.navbar = [];
        this._config.form.navbar.push({name: 'expand', type: 'expand'});
        this._config.form.footer.push({name: 'cancel', type: 'cancel', iconOnly: true});
        this._config.form.fields = [];
        this._config.form.fields.push({name: 'format', type: 'select', default: 'xlsx', data: ['xlsx', 'ods,', 'csv', 'html'], require: true});
        this._config.form.fields.push({name: 'fields', type: 'select_multiple'});
        this._config.form.fields.push({name: 'upload', type: 'attachment'});
        this._config._onInit = async ($event: any): Promise<any> => {
          this.setValue([{}]);
        };
        this._config._onSubmit = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        this._config._onCancel = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        break;
      }

      // Submit
      case 'submit': {
        this._config.form.header = [];
        this._config.form.header.push({name: 'testi', type: 'value'});

        this._config._onInit = async ($event: any): Promise<any> => {
          this.setValue([{}]);
        };
        this._config._onSubmit = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        this._config._onCancel = async ($event: any): Promise<any> => {
          this._component.data.goto(`${this._config.type}/search`);
        };
        break;
      }
    }

    // Items o Value?
    if (!this._config.showFields) {
      this._config.form.fields = [{name: 'testi', type: 'value'}];
    }

    // Define styles
    const styles: any = {};
    styles.show = {visibility: 'visible', opacity: '1', transition: 'visibility 0s linear 0s, opacity 300ms'};
    styles.hide = {visibility: 'hidden', opacity: '0', transition: 'visibility 0s linear 300ms, opacity 300ms', height: '0 !important', marginTop: '-2px'};

    // Define events
    const events: any = {};
    events.filter = async ($event: any): Promise<any> => {
      this._config.showFilter = !this._config.showFilter;
      $event.detail.item._config.iconColor = this._config.showFilter ? 'dark' : 'medium';
      this._parent.filter._component._elementStyle = this._config.showFilter ? styles.show : styles.hide;
    };
    events.metric = async ($event: any): Promise<any> => {
      this._config.showMetric = !this._config.showMetric;
      $event.detail.item._config.iconColor = this._config.showMetric ? 'dark' : 'medium';
      this._parent.metric._component._elementStyle = this._config.showMetric ? styles.show : styles.hide;
    };
    events.download = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data._onPageSelectAndDownload($event, this);
    };
    events.print = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data._onPageSelectAndPrint($event, this);
    };
    events.share = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data._onPageSelectAndShare($event, this);
    };
    events.sendmail = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data._onPageSelectAndSendmail($event, this);
    };
    events.search = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data.goto(`${this._config.type}/search`);
    };
    events.select = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data.goto(`${this._config.type}/select/:_id`, this._config.params);
    };
    events.delete = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data.goto(`${this._config.type}/delete/:_id`, this._config.params);
    };
    events.update = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data.goto(`${this._config.type}/update/:_id`, this._config.params);
    };
    events.create = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data.goto(`${this._config.type}/create`);
    };
    events.import = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data.goto(`${this._config.type}/import`);
    };
    events.export = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data.goto(`${this._config.type}/export`);
    };
    events.cancel = async ($event: any): Promise<any> => {
      await $event.detail.item._component.data.goto(`${this._config.type}/search`);
    };
    for (const item of this._config.form.navbar || []) {
      if (item.type === 'button' && typeof item.iconOnly === 'undefined') {
        item.iconOnly = true;
      }
      if (item.type === 'button' && typeof item.onClick === 'undefined' && typeof events[`${item.name}`] === 'function') {
        item.onClick = events[`${item.name}`];
      }
    }

    // Define header values
    const header: any = {elementClass: 'flb-list flb-list-header', fields: [], values: [{}]};
    if (this._config.form.header?.length) {
      this._config.form.header.map((v: any) => header.fields.push(this.clone(v)));
    }

    // Define navbar values
    const navbar: any = {elementClass: 'flb-list flb-list-navbar', fields: [], values: [{}]};
    if (this._config.form.navbar?.length) {
      this._config.form.navbar.map((v: any) => navbar.fields.push(this.clone(v)));
    }

    // Define filter values
    const filter: any = {elementClass: 'flb-list flb-list-filter', elementStyle: styles.hide, fields: [], values: [{}]};
    if (this._config.form.filter?.length) {
      this._config.form.filter.map((v: any) => filter.fields.push(this.clone(v)));
    }

    // Define metric values
    const metric: any = {elementClass: 'flb-list flb-list-metric', elementStyle: styles.hide, fields: [], values: [{}]};
    if (this._config.form.metric?.length) {
      this._config.form.metric.map((v: any) => metric.fields.push(this.clone(v)));
    }

    // Define result values
    const result: any = {elementClass: 'flb-list flb-list-result', fields: [], values: []};
    if (this._config.form?.fields?.length) {
      this._config.form.fields.map((v: any) => result.fields.push(this.clone(v)));
    }

    // Define footer values
    const footer: any = {elementClass: 'flb-list flb-list-footer', fields: [], values: [{}]};
    if (this._config.form?.footer?.length) {
      this._config.form.footer.map((v: any) => footer.fields.push(this.clone(v)));
    }

    // Define value
    this.value = [];
    if (header.fields.length) {
      this._parent.header = new List(header, this);
      this.value.push(this._parent.header);
    }
    if (navbar.fields.length) {
      this._parent.navbar = new List(navbar, this);
      this.value.push(this._parent.navbar);
    }
    if (filter.fields.length) {
      this._parent.filter = new List(filter, this);
      this.value.push(this._parent.filter);
    }
    if (metric.fields.length) {
      this._parent.metric = new List(metric, this);
      this.value.push(this._parent.metric);
    }
    if (result.fields.length) {
      this._parent.result = new List(result, this);
      this.value.push(this._parent.result);
    }
    if (footer.fields.length) {
      this._parent.footer = new List(footer, this);
      this.value.push(this._parent.footer);
    }
  }

  /**
   * Get header
   */
  getHeader(): any {
    return this._parent.header.getValue();
  }

  /**
   * Set header
   */
  setHeader(value: any = []) {
    this._parent.header.setValue(value);
  }

  /**
   * Get value
   */
  getValue(): any {
    return this._parent.result.getValue();
  }

  /**
   * Set value
   */
  setValue(value: any = [], add: boolean = false) {
    this._parent.result.setValue(value);
  }

  // Get value from slots
  getValueFromSlots(slots: any = [], value: any = {}): any {
    // Get value from field // TODO: add display value
    const getValueFromFields = (fields: any[], value: any = {}): any[] => {
      return fields.map((i: any) => getValueFromField(i, value)).filter((v: any) => !!v);
    };
    const getValueFromField = (field: any, value: any = {}): any => {
      return field.name.split('.').reduce((o: any, k: any) => (o || {})[k], value);
    };

    const result: any = {};
    if (slots.index?.length) {
      result.index = getValueFromFields(slots.index, value).shift() || '';
    } else {
      result.index = value._id || value.id || '';
    }
    if (slots.title?.length) {
      result.title = getValueFromFields(slots.title, value).join(' ') || '';
    }
    if (slots.label?.length) {
      result.label = getValueFromFields(slots.label, value).join(' ') || '';
    }
    if (slots.count?.length) {
      result.count = getValueFromFields(slots.count, value).join(' ') || '';
    }
    if (slots.total?.length) {
      result.total = getValueFromFields(slots.total, value).join(' ') || '';
    }
    if (slots.notes?.length) {
      result.notes = getValueFromFields(slots.notes, value) || [];
    }
    if (slots.image?.length) {
      result.image = getValueFromFields(slots.image, value).shift() || '';
    }
    if (slots.video?.length) {
      result.video = getValueFromFields(slots.video, value).shift() || '';
    }
    if (slots.state?.length) {
      result.state = getValueFromFields(slots.state, value).shift() || '';
    }
    if (slots.color?.length) {
      result.color = getValueFromFields(slots.color, value).shift() || '';
    }
    if (slots.style?.length) {
      result.style = getValueFromFields(slots.style, value).shift() || {};
    }
    result.value = value;
    Object.keys(result).forEach((k: any) => (result[k] === undefined ? delete result[k] : {}));
    return result;
  }

  // Get slot from items
  getSlotsFromItems(items: any[] = []): any[] {
    const getSlot = (f: any[], s: string): any => {
      return f.reduce((a: any, i: any) => [...(a || []), ...(i.slot === s ? [i] : []), ...(i.fields ? getSlot(i.fields, s) || [] : [])], null) || [];
    };
    const result: any = {};
    result.title = getSlot(items, 'title');
    result.label = getSlot(items, 'label');
    result.notes = getSlot(items, 'notes');
    result.image = getSlot(items, 'image');
    result.video = getSlot(items, 'video');
    result.state = getSlot(items, 'state');
    result.color = getSlot(items, 'color');
    result.style = getSlot(items, 'style');
    Object.keys(result).forEach((k: any) => (result[k] === undefined || !result[k].length ? delete result[k] : {}));
    return result;
  }
}
