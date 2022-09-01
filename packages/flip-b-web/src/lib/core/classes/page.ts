import {Base} from './base';
import {List} from './list';

/**
 * Page
 */
export class Page extends Base {
  // Definitions

  /**
   * Value
   * @attribute {Array}
   */
  value: List[] = [];

  /**
   * Init event handler
   */
  async onInit(): Promise<any> {
    //if (!this._component.modal) {
    //  const router: any = this._component._context.page.router.routerState.snapshot.root.firstChild;
    //  const config: any = router.data['page'] || {};
    //  this._config = this._config || {};
    //  this._config.name = this._config.name || config.name || undefined;
    //  this._config.type = this._config.type || config.type || undefined;
    //  this._config.mode = this._config.mode || config.mode || undefined;
    //  this._config.load = this._config.load || config.load || undefined;
    //  this._config.params = {...router.params, ...router.queryParams, ...history.state};
    //  delete this._config.params.navigationId;
    //}
    if (typeof this._config.load === 'function') {
      const config: any = await this._config.load();
      this._config = {...this.clone(this._config), ...this.clone(config)};
    }

    // Define attributes
    const attributes = ['elementClass', 'elementStyle', 'name', 'type', 'mode', 'text', 'path', 'show', 'form', 'params'];
    const attributesEvents = ['onSetup', 'onClick', 'onEnter', 'onLeave', 'onInput', 'onChange', 'onReload', 'onSearch', 'onSelect', 'onSubmit', 'onCancel', 'onScroll'];
    for (const a of attributes) {
      this._config[`${a}`] = (typeof this._config[`${a}`] === 'function' ? this._config[`${a}`](this) : this._config[`${a}`]) || undefined;
    }
    for (const k in this._config) {
      if (!attributes.includes(k) && !attributesEvents.includes(k)) {
        delete this._config[`${k}`];
      }
    }

    // Verify name
    if (typeof this._config.name !== 'string' || !this._config.name) {
      throw new Error('The value for option "name" is invalid.');
    }

    // Verify type
    if (typeof this._config.type === 'undefined') {
      this._config.type = this._config.name.split('.')[0];
    }
    if (typeof this._config.type !== 'string' || !this._config.type) {
      throw new Error('The value for option "type" is invalid.');
    }

    // Verify mode
    if (typeof this._config.mode === 'undefined') {
      this._config.mode = this._config.name.split('.')[1];
    }
    if (typeof this._config.mode !== 'string' || !['search', 'select', 'create', 'update', 'delete', 'export', 'import', 'submit', 'viewer'].includes(this._config.mode)) {
      this._config.mode = 'submit';
    }
    if (typeof this._config.mode !== 'string' || !['search', 'select', 'create', 'update', 'delete', 'export', 'import', 'submit', 'viewer'].includes(this._config.mode)) {
      throw new Error('The value for option "mode" is invalid.');
    }

    // Verify path
    if (typeof this._config.path === 'undefined') {
      this._config.path = this._config.name.split('.')[0];
    }
    if (typeof this._config.path !== 'string' || !this._config.path) {
      throw new Error('The value for option "path" is invalid.');
    }

    //this.url = this._config.url || `${this._parent.site.config.values.http?.url || ''}` || '';
    //this.uri = this._config.uri || `${this._parent.site.config.values.http?.uri || ''}${this._parent.site.config.values.http?.api || ''}` || '';

    this._config.form = this._config.form || {};
    this._config.show = this._config.show || ['flip'];
    this._config.showFilter = this._config.showFilter ? true : false;
    this._config.showMetric = this._config.showMetric ? true : false;
    this._config.showFields = this._config.showFields ? true : false;

    // Define flip values
    if (this._config.show.includes('flip')) {
      if (this._config.mode === 'search') {
        this._config.show = ['header', 'navbar', 'result', 'filter', 'metric', 'expand', 'export', 'import', 'create'];
        this._config.showFields = false;
      } else if (this._config.mode === 'select') {
        this._config.show = ['header', 'navbar', 'result', 'share', 'copy', 'download', 'print', 'send', 'expand', 'delete', 'update', 'cancel'];
        this._config.showFields = true;
      } else if (this._config.mode === 'submit') {
        this._config.show = ['header', 'navbar', 'result', 'footer'];
        this._config.showFields = true;
      } else {
        this._config.show = ['header', 'navbar', 'result', 'footer', 'expand', 'cancel', 'submit'];
        this._config.showFields = true;
      }
    }

    // Define crud values
    if (this._config.show.includes('crud')) {
      if (this._config.mode === 'search') {
        this._config.show = ['header', 'navbar', 'result', 'filter', 'expand', 'create'];
        this._config.showFields = false;
      } else if (this._config.mode === 'select') {
        this._config.show = ['header', 'navbar', 'result', 'expand', 'delete', 'update', 'cancel'];
        this._config.showFields = true;
      } else if (this._config.mode === 'submit') {
        this._config.show = ['header', 'navbar', 'result', 'footer'];
        this._config.showFields = true;
      } else {
        this._config.show = ['header', 'navbar', 'result', 'footer', 'expand', 'cancel', 'submit'];
        this._config.showFields = true;
      }
    }

    // Delete mode definitions
    if (this._config.mode === 'delete') {
      this._config.form.fields = [];
    }

    //const fields: any = this.getInputs(this.fields, {}, page);
    //const values: any = this.getInputsToSelect(fields);
    //const select: any = values.filter((v: any) => v.selected).map((v: any) => v.value);
    //const report: any = this.getI18n(`${this._config.name}.search.title`);
    //const params: any = page.params;

    // Export mode definitions
    if (this._config.mode === 'export') {
      this._config.form.fields = [];
      this._config.form.fields.push({name: 'format', type: 'select', default: 'xlsx', data: ['xlsx', 'ods,', 'csv', 'html'], require: true});
      this._config.form.fields.push({name: 'fields', type: 'select_multiple'});
      this._config.form.fields.push({name: 'values', type: 'object', hide: true});
      this._config.form.fields.push({name: 'report', type: 'object', hide: true});
      this._config.form.fields.push({name: 'params', type: 'object', hide: true});
    }

    // Import mode definitions
    if (this._config.mode === 'import') {
      this._config.form.fields = [];
      this._config.form.fields.push({name: 'format', type: 'select', default: 'xlsx', data: ['xlsx', 'ods,', 'csv', 'html'], require: true});
      this._config.form.fields.push({name: 'fields', type: 'select_multiple'});
      this._config.form.fields.push({name: 'upload', type: 'attachment'});
      this._config.form.fields.push({name: 'values', type: 'object', hide: true});
      this._config.form.fields.push({name: 'report', type: 'object', hide: true});
      this._config.form.fields.push({name: 'params', type: 'object', hide: true});
    }

    // Define infinity scroll event
    if (this._config.mode === 'search') {
      this._config._onScroll = ($event: any) => {
        const $el = this._component._element.nativeElement;
        const pos: number = $el.scrollTop + $el.offsetHeight;
        const max: number = $el.scrollHeight;
        if (pos > 0 && pos >= max && !this._config.searching) {
          console.log('Call infinity scroll', pos, max, {$event});
          this._config.searching = true;
          setTimeout(() => {
            this.addValues(10);
            this._config.searching = false;
          }, 500);
        }
      };
      this._config._onSelect = async ($event: any): Promise<any> => {
        this._component._context.goto(`${this._config.type}/select/123`);
      };
    } else {
      this._config._onCancel = async ($event: any): Promise<any> => {
        this._component._context.goto(`${this._config.type}/search`);
      };
      this._config._onSubmit = async ($event: any): Promise<any> => {
        console.log('Submit', await $event.detail.form.getValue());
        this._component._context.goto(`${this._config.type}/search`);
      };
    }

    // Get value from fields
    const getValueFromFields = (fields: any[], value: any = {}): any[] => {
      return fields.map((i: any) => getValueFromField(i, value)).filter((v: any) => !!v);
    }

    // Get value from field // TODO: add display value
    const getValueFromField = (field: any, value: any = {}): any => {
      return field.path.split('.').reduce((o: any, k: any) => (o || {})[k], value);
    }

    // Get value from slots
    const getValueFromSlots = (slots: any = [], value: any = {}): any => {
      const result: any = {};
      result._id = value._id || value.id || undefined;
      result.type = value.type || 'value';
      result.mode = value.mode || 'value';
      result.size = value.size || undefined;
      result.icon = value.icon || undefined;
      result.value = value;
      if (slots.index?.length) {
        result.index = getValueFromFields(slots.index, value).shift() || '';
      }
      if (slots.title?.length) {
        result.title = getValueFromFields(slots.title, value).join(' ') || '';
      }
      if (slots.label?.length) {
        result.label = getValueFromFields(slots.label, value).join(' ') || '';
      }
      if (slots.count?.length) {
        result.count = getValueFromFields(slots.count, value).shift() || '';
      }
      if (slots.total?.length) {
        result.total = getValueFromFields(slots.total, value).shift() || '';
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
      if (slots.style?.length) {
        result.style = getValueFromFields(slots.style, value).shift() || {};
      }
      if (slots.color?.length) {
        result.color = getValueFromFields(slots.color, value).shift() || '';
      }
      Object.keys(result).forEach((k: any) => result[k] === undefined ? delete result[k] : {});
      return result;
    };

    // Get slot from items
    const getSlotsFromItems = (items: any[] = []): any[] => {
      const getSlot = (f: any[], s: string): any => {
        return f.reduce((a: any, i: any) => [...(a || []), ...(i.slot === s ? [i] : []), ...(i.fields ? getSlot(i.fields, s) || [] : [])], null) || [];
      };
      const result: any = {};
      result.title = getSlot(check, 'title');
      result.label = getSlot(check, 'label');
      result.notes = getSlot(check, 'notes');
      result.image = getSlot(check, 'image');
      result.video = getSlot(check, 'video');
      result.state = getSlot(check, 'state');
      result.color = getSlot(check, 'color');
      result.style = getSlot(check, 'style');
      Object.keys(result).forEach((k: any) => result[k] === undefined || !result[k].length ? delete result[k] : {});
      return result;
    };

    // Define slots
    const check: any = [];
    if (this._config.form?.fields?.length) {
      this._config.form.fields.map((v: any) => check.push(this.clone(v)));
    }
    const slots: any = getSlotsFromItems(check);

    if (!this._config.showFields) {
      this._config.form.fields = [{name: 'testi', type: 'value'}];
    }

     // Define events
    const events: any = {};
    events['filter'] = ($event: any) => {
      this._config.showFilter = !this._config.showFilter;
      $event.detail.item._config.color = this._config.showFilter ? 'dark' : 'medium';
    };
    events['metric'] = ($event: any) => {
      this._config.showMetric = !this._config.showMetric;
      $event.detail.item._config.color = this._config.showMetric ? 'dark' : 'medium';
    };
    events['share'] = ($event: any) => {
      $event.detail.item._component._context.call('share', $event);
    };
    events['copy'] = ($event: any) => {
      $event.detail.item._component._context.call('copy', $event);
    };
    events['download'] = ($event: any) => {
      $event.detail.item._component._context.call('download', $event);
    };
    events['print'] = ($event: any) => {
      $event.detail.item._component._context.call('print', $event);
    };
    events['send'] = ($event: any) => {
      $event.detail.item._component._context.call('send', $event);
    };
    events['search'] = ($event: any) => {
      $event.detail.item._component._context.goto(`${this._config.type}/search`);
    };
    events['select'] = ($event: any) => {
      $event.detail.item._component._context.goto(`${this._config.type}/select/:_id`, this._config.params);
    };
    events['delete'] = ($event: any) => {
      $event.detail.item._component._context.goto(`${this._config.type}/delete/:_id`, this._config.params);
    };
    events['update'] = ($event: any) => {
      $event.detail.item._component._context.goto(`${this._config.type}/update/:_id`, this._config.params);
    };
    events['create'] = ($event: any) => {
      $event.detail.item._component._context.goto(`${this._config.type}/create`);
    };
    events['import'] = ($event: any) => {
      $event.detail.item._component._context.goto(`${this._config.type}/import`);
    };
    events['export'] = ($event: any) => {
      $event.detail.item._component._context.goto(`${this._config.type}/export`);
      console.log()
    };
    events['cancel'] = ($event: any) => {
      $event.detail.item._component._context.goto(`${this._config.type}/search`);
    };

    // Define header values
    const header: any = {elementClass: 'flb-list flb-list-header', elementStyle: {}, fields: [], values: [{}]};
    if (this._config.show.includes('header') && this._config.form.header?.length) {
      this._config.form.header.map((v: any) => header.fields.push(this.clone(v)));
    }
    if (this._config.show.includes('header')) {
      header.fields.push({name: 'testi', type: 'value'});
    }

    // Define navbar values
    const navbar: any = {elementClass: 'flb-list flb-list-navbar', fields: [], values: [{}]};
    if (this._config.show.includes('navbar') && this._config.show.includes('filter')) {
      navbar.fields.push({name: 'filter', type: 'button', icon: 'filter-circle'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('metric')) {
      navbar.fields.push({name: 'metric', type: 'button', icon: 'stop-circle'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('share')) {
      navbar.fields.push({name: 'share', type: 'button', icon: 'share-social'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('copy')) {
      navbar.fields.push({name: 'copy', type: 'button', icon: 'clipboard'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('download')) {
      navbar.fields.push({name: 'download', type: 'button', icon: 'cloud-download'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('print')) {
      navbar.fields.push({name: 'print', type: 'button', icon: 'print'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('send')) {
      navbar.fields.push({name: 'send', type: 'button', icon: 'mail'});
    }
    if (this._config.show.includes('navbar') && this._config.form.navbar?.length) {
      this._config.form.navbar.map((v: any) => navbar.fields.push(this.clone(v)));
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('expand')) {
      navbar.fields.push({name: 'expand', type: 'expand'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('export')) {
      navbar.fields.push({name: 'export', type: 'button', icon: 'cloud-download'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('import')) {
      navbar.fields.push({name: 'import', type: 'button', icon: 'cloud-upload'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('create')) {
      navbar.fields.push({name: 'create', type: 'button', icon: 'add-circle'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('delete')) {
      navbar.fields.push({name: 'delete', type: 'button', icon: 'trash'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('update')) {
      navbar.fields.push({name: 'update', type: 'button', icon: 'create'});
    }
    if (this._config.show.includes('navbar') && this._config.show.includes('cancel')) {
      navbar.fields.push({name: 'cancel', type: 'cancel', iconOnly: true});
    }
    if (navbar.fields.length) {
      for (const item of navbar.fields) {
        if (item.type === 'button' && typeof item.iconOnly === 'undefined') {
          item.iconOnly = true;
        }
        if (item.type === 'button' && typeof item.onClick === 'undefined' && typeof events[`${item.name}`] === 'function') {
          item.onClick = events[`${item.name}`];
        }
      }
    }

    // Define filter values
    const filter: any = {elementClass: 'flb-list flb-list-filter', fields: [], values: [{}]};
    if (this._config.show.includes('filter') && this._config.form.filter?.length) {
      this._config.form.filter.map((v: any) => filter.fields.push(this.clone(v)));
    }

    // Define metric values
    const metric: any = {elementClass: 'flb-list flb-list-metric', fields: [], values: [{}]};
    if (this._config.show.includes('metric') && this._config.form.metric?.length) {
      this._config.form.metric.map((v: any) => metric.fields.push(this.clone(v)));
    }

    // Define result values
    const result: any = {elementClass: 'flb-list flb-list-result', fields: [], values: []};
    if (this._config.show.includes('result') && this._config.form?.fields?.length) {
      this._config.form.fields.map((v: any) => result.fields.push(this.clone(v)));
    }

    // Define footer values
    const footer: any = {elementClass: 'flb-list flb-list-footer', fields: [], values: [{}]};
    if (this._config.show.includes('footer') && this._config.form?.footer?.length) {
      this._config.form.footer.map((v: any) => footer.fields.push(this.clone(v)));
    }
    if (this._config.show.includes('footer') && this._config.show.includes('submit')) {
      footer.fields.push({name: 'submit', type: 'submit', size: 50});
    }
    if (this._config.show.includes('footer') && this._config.show.includes('cancel')) {
      footer.fields.push({name: 'cancel', type: 'cancel', size: 50});
    }

    // Define value
    this.value = [];
    if (header.fields.length) {
      this._parent.header = new List(header, this);
      await this._parent.header.onInit();
      this.value.push(this._parent.header);
    }
    if (navbar.fields.length) {
      this._parent.navbar = new List(navbar, this);
      await this._parent.navbar.onInit();
      this.value.push(this._parent.navbar);
    }
    if (filter.fields.length) {
      this._parent.filter = new List(filter, this);
      await this._parent.filter.onInit();
      this.value.push(this._parent.filter);
    }
    if (metric.fields.length) {
      this._parent.metric = new List(metric, this);
      await this._parent.metric.onInit();
      this.value.push(this._parent.metric);
    }
    if (result.fields.length) {
      this._parent.result = new List(result, this);
      await this._parent.result.onInit();
      this.value.push(this._parent.result);
    }
    if (footer.fields.length) {
      this._parent.footer = new List(footer, this);
      await this._parent.footer.onInit();
      this.value.push(this._parent.footer);
    }

    setTimeout(() => {
      if (this._config.showFields) {
        this.addValues(1);
      } else {
        this.addValues(10);
      }
    }, 100);
    console.log(this);
  }

  addValues(limit: number) {
    const values: any = [];
    for (let i = 1; i <= limit; i++) {
      values.push({name: `My row ${i}`, group: 'My group!'});
    }
    this._parent.result.setValue(values);
  }
}
