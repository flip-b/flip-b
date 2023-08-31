import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {DataService} from '../core/data.service';

@Component({
  selector: 'flb-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  // Definitions

  /**
   * Form
   */
  @Input() form: any;

  /**
   * Modal
   */
  @Input() modal: any;

  /**
   * Constructor
   */
  constructor(
    public data: DataService,
    public _element: ElementRef
  ) {}

  /**
   * Init angular handler
   */
  async ngOnInit(): Promise<any> {
    if (typeof this.form === 'undefined') {
      const snap: any = await this.data.page.snap();
      this.form = {};
      this.form.name = snap.data.name || undefined;
      this.form.type = snap.data.type || undefined;
      this.form.rest = snap.data.rest || undefined;
      this.form.meta = snap.data.meta || undefined;
      this.form.body = snap.data.body || undefined;
      this.form.data = snap.data.data || {...snap.params, ...snap.queryParams, ...history.state};
      this.form.load = snap.data.load || undefined;
    }

    // Define form from load function
    if (typeof this.form.load === 'function') {
      this.form = {...this.form, ...(await this.form.load())};
    }

    // Define form
    window.form = setForm({form: this.form, self: this});
  }

  /**
   * Trigger
   */
  async trigger(name: string, item: any = undefined, $event: any = undefined): Promise<any> {
    await events[name]({form: this.form, item, $event});
    if (typeof $event?.target?.complete === 'function') {
      $event.target.complete();
    }
    this._element.nativeElement.dispatchEvent(new CustomEvent(name, {detail: {form: this.form, item, $event}}));
  }
}

/***********************************************************************************************************************
 *** Events
 ********************************************************************************************************************/

const events: any = {};
events['form.onStart'] = formStart;
events['item.onSetup'] = itemSetup;
events['item.onClick'] = itemClick;
events['item.onEnter'] = itemEnter;
events['item.onLeave'] = itemLeave;
events['item.onInput'] = itemInput;

/***********************************************************************************************************************
 *** Form Start
 ********************************************************************************************************************/

async function formStart({form, $event}: any): Promise<any> {
  try {
    await form.page.loading({message: `${form.name}$${form.type}`});

    if (form.type === 'search') {
      if ($event?.type === 'ionInfinite') {
        form.values = form.values || [];
      } else {
        form.values = [];
      }

      form.data.filter = form.data.filter || {};
      form.data.filter.skip = form.values.length;
      form.data.filter.limit = form.data.filter.limit || 20;

      let result: any = [];

      if (form.data.search) {
        result = [...form.data.search];
      } else if (form.rest) {
        result = await form.http.request({search: form.rest, qs: form.data.filter});
      }

      if (form.onSearch) {
        result = await form.onSearch({form, values: result});
      }

      for (const v of result) {
        const item: any = setItem({form, item: {name: 'select', type: 'values'}});
        item.value = setSlotValue(form, v);
        form.values.push(item);
      }

      if (form.data.filter.skip === 0 && !form.values.length && form.uses.includes('create')) {
        const item: any = setItem({form, item: {name: 'create', type: 'values', onClick: itemCreateButtonClick}});
        form.values.push(item);
      }

      if (form.data.filter.skip === 0 && !form.values.length && form.uses.includes('create') === false) {
        const item: any = setItem({form, item: {name: 'asless', type: 'values'}});
        form.values.push(item);
      }
    } else {
      let result: any = {};

      form.body.values = setBodyValue(form, form.fields, result);

      if (form.data.select) {
        result = {...form.data.select};
      } else if (form.rest && form.data.index) {
        result = await form.http.request({select: form.rest, data: {index: form.data.index}});
      }

      if (form.onSelect) {
        result = await form.onSelect({form, result});
      }

      form.body.values = setBodyValue(form, form.fields, result);
      form.body.result = {};

      if (form.header[0]?.type === 'header') {
        form.header[0].value = setSlotValue(form, form.body.values);
      }
    }
    await form.page.success({message: `${form.name}$${form.type}`});
  } catch (error: any) {
    await form.page.warning({message: `${form.name}$${form.type}`, error});
  }
}

/***********************************************************************************************************************
 *** Item Setup
 ********************************************************************************************************************/

async function itemSetup({form, item, $event}: any): Promise<any> {
  try {
    let show: any = true;
    if (setItemValue({form, item, $event, action: 'setup'}) === false) {
      show = false;
    } else if (item.onSetup) {
      show = await item.onSetup({form, item});
    } else if (form.onSetup) {
      show = await form.onSetup({form, item});
    }
    if (show === false) {
      item.hide = true;
    }
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Click
 ********************************************************************************************************************/

async function itemClick({form, item, $event}: any): Promise<any> {
  try {
    if (setItemValue({form, item, $event, action: 'click'}) === false) {
      return;
    } else if (item.onClick) {
      await item.onClick({form, item});
    } else if (form.onClick) {
      await form.onClick({form, item});
    }
    if (item.disabled) {
      delete item.disabled;
    }
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Enter
 ********************************************************************************************************************/

async function itemEnter({form, item, $event}: any): Promise<any> {
  try {
    if (setItemValue({form, item, $event, action: 'enter'}) === false) {
      return;
    } else if (item.onEnter) {
      await item.onEnter({form, item});
    } else if (form.onEnter) {
      await form.onEnter({form, item});
    }
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Leave
 ********************************************************************************************************************/

async function itemLeave({form, item, $event}: any): Promise<any> {
  try {
    if (setItemValue({form, item, $event, action: 'leave'}) === false) {
      return;
    } else if (item.onLeave) {
      await item.onLeave({form, item});
    } else if (form.onLeave) {
      await form.onLeave({form, item});
    }
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Input
 ********************************************************************************************************************/

async function itemInput({form, item, $event}: any): Promise<any> {
  try {
    if (setItemValue({form, item, $event, action: 'input'}) === false) {
      return;
    } else if (item.onInput) {
      await item.onInput({form, item});
    } else if (form.onInput) {
      await form.onInput({form, item});
    }
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Search Action
 ********************************************************************************************************************/

async function itemSearchActionInput({form, item}: any): Promise<any> {
  try {
    if (form.onSearchValues) {
      return await form.onSearchValues({form, item});
    }
    form.data.filter = form.data.filter || {};
    form.data.filter.query = item.$ctrl.currentValue;
    form.data.filter.where = {...(form.data.filter.where || {}), ...(form.body.values || {})};
    await form.self.trigger('form.onStart');
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Select Values
 ********************************************************************************************************************/

async function itemSelectValuesClick({form, item}: any): Promise<any> {
  try {
    if (form.onSelectValues) {
      return await form.onSelectValues({form, item, data: item.$ctrl.currentValue.value});
    }
    const result: any = await form.open({...form.copy, type: 'update', data: item.$ctrl.currentValue});
    if (result?.submit) {
      item.value = setSlotValue(form, result.form.body.values);
      item.class['update'] = true;
      setTimeout(() => (item.class['update'] = false), 500);
    }
    if (result?.delete) {
      item.value = {};
      item.class['delete'] = true;
      setTimeout(() => (item.class['delete'] = false), 500);
      setTimeout(() => (item.hide = true), 500);
    }
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Filter Button
 ********************************************************************************************************************/

async function itemFilterButtonClick({form, item}: any): Promise<any> {
  try {
    item.class['active'] = !item.class['active'];
    form.filterClass['hide'] = item.class['active'] ? false : true;
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Create Button
 ********************************************************************************************************************/

async function itemCreateButtonClick({form, item}: any): Promise<any> {
  try {
    const result: any = await form.open({...form.copy, type: 'create', meta: form.meta});

    if (result?.submit) {
      const adds = setItem({form, item: {name: 'select', type: 'values', value: setSlotValue(form, result.form.body.values)}});
      if (form.values.length > 10) {
        form.values.unshift(adds);
      } else {
        form.values.push(adds);
      }
      adds.class['create'] = true;
      setTimeout(() => (adds.class['create'] = false), 500);
    }
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Delete Button
 ********************************************************************************************************************/

async function itemDeleteButtonClick({form, item}: any): Promise<any> {
  try {
    const params: any = await form.page.confirm({path: `${form.name}.$delete`, data: form.body, type: 'danger'});
    if (!params?.submit) {
      return;
    }
    await form.page.loading({message: item.path});
    if (form.rest) {
      await form.http.request({delete: form.rest, data: form.data});
    }
    if (form.onDelete) {
      await form.onDelete({form, item});
    }
    if (form.onFinish) {
      await form.onFinish({form, item, delete: true});
    }
    await form.page.success({message: item.path, value: form.body});
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Cancel Button
 ********************************************************************************************************************/

async function itemCancelButtonClick({form, item}: any): Promise<any> {
  try {
    await form.page.loading({message: item.path});
    if (form.onCancel) {
      await form.onCancel({form, item});
    }
    if (form.onFinish) {
      await form.onFinish({form, item, cancel: true});
    }
    await form.page.success({message: item.path, value: form.body});
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Submit Button
 ********************************************************************************************************************/

async function itemSubmitButtonClick({form, item}: any): Promise<any> {
  try {
    await form.page.loading({message: item.path});

    if (!form.rest) {
      form.body.result = {};
    } else if (form.type === 'create') {
      form.body.result = await form.http.request({create: form.rest, data: form.data, body: form.body.values});
    } else if (form.type === 'update') {
      form.body.result = await form.http.request({update: form.rest, data: form.data, body: form.body.values});
    } else {
      form.body.result = await form.http.request({submit: form.rest, data: form.data, body: form.body.values});
    }

    if (form.body.result?.status === 200 && form.body.result?.headers) {
      await form.page.browserDownload(form.body.result);
    }

    if (form.onSubmit) {
      await form.onSubmit({form, item});
    }
    if (form.onFinish) {
      await form.onFinish({form, item, submit: true});
    }
    await form.page.success({message: item.path, value: form.body});
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Download Button
 ********************************************************************************************************************/

async function itemDownloadButtonClick({form, item}: any): Promise<any> {
  try {
    await form.page.loading({message: item.path});
    const result: any = await form.http.request({select: form.rest, data: {index: form.data.index}, qs: {action: 'download'}, type: 'blob'});
    await form.page.browserDownload(result);
    await form.page.success({message: item.path, value: form.body});
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Print Button
 ********************************************************************************************************************/

async function itemPrintButtonClick({form, item}: any): Promise<any> {
  try {
    await form.page.loading({message: item.path});
    const result: any = await form.http.request({select: form.rest, data: {index: form.data.index}, qs: {action: 'print'}, type: 'blob'});
    await form.page.browserPrint(result);
    await form.page.success({message: item.path, value: form.body});
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Share Button
 ********************************************************************************************************************/

async function itemShareButtonClick({form, item}: any): Promise<any> {
  try {
    await form.page.loading({message: item.path});
    const result: any = await form.http.request({select: form.rest, data: {index: form.data.index}, qs: {action: 'share'}, type: 'blob'});
    await form.page.browserShare(result);
    await form.page.success({message: item.path, value: form.body});
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Sendmail Button
 ********************************************************************************************************************/

async function itemSendmailButtonClick({form, item}: any): Promise<any> {
  try {
    const params: any = await form.page.confirm({path: `${form.name}.$sendmail`, data: form.body, form: [{name: 'email', type: 'email', value: form.user.values.email}]});
    if (!params?.submit || !params?.result?.email) {
      return;
    }
    await form.page.loading({message: item.path});
    const result: any = await form.http.request({select: form.rest, data: {index: form.data.index}, qs: {action: 'sendmail', email: params.result.email}, type: 'blob'});
    await form.page.browserSendmail(result);
    await form.page.success({message: item.path, value: form.body});
  } catch (error: any) {
    await form.page.warning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Set form
 ********************************************************************************************************************/

function setForm({form, self}: any): any {
  const copy: any = {...form};

  // Define item
  form = {};

  // Define name
  // @param {String}
  form.name = typeof copy.name === 'string' ? copy.name : undefined;
  if (!form.name) {
    throw new Error('Form name is required');
  }

  // Define type
  // @param {String}
  form.type = typeof copy.type === 'string' ? copy.type : undefined;
  if (!form.type) {
    throw new Error('Form type is required');
  }

  // Define rest
  // @param {String}
  form.rest = typeof copy.rest === 'string' ? copy.rest : undefined;

  // Define meta
  // @param {Object}
  form.meta = {...(copy.meta || {})};

  // Define body
  // @param {Object}
  form.body = {...(copy.body || {})};

  // Define data
  // @param {Object}
  form.data = {...(copy.data || {})};

  // Define header
  // @param {Array}
  form.header = [...(copy.header || [])];

  // Define header class
  // @param {Object}
  form.headerClass = {...(copy.headerClass || {})};

  // Define header style
  // @param {Object}
  form.headerStyle = {...(copy.headerStyle || {})};

  // Define footer
  // @param {Array}
  form.footer = [...(copy.footer || [])];

  // Define footer class
  // @param {Object}
  form.footerClass = {...(copy.footerClass || {})};

  // Define footer style
  // @param {Object}
  form.footerStyle = {...(copy.footerStyle || {})};

  // Define navbar
  // @param {Array}
  form.navbar = [...(copy.navbar || [])];

  // Define navbar class
  // @param {Object}
  form.navbarClass = {...(copy.navbarClass || {})};

  // Define navbar style
  // @param {Object}
  form.navbarStyle = {...(copy.navbarStyle || {})};

  // Define filter
  // @param {Array}
  form.filter = [...(copy.filter || [])];

  // Define filter class
  // @param {Object}
  form.filterClass = {...(copy.filterClass || {})};

  // Define filter style
  // @param {Object}
  form.filterStyle = {...(copy.filterStyle || {})};

  // Define fields
  // @param {Array}
  form.fields = [...(copy.fields || [])];

  // Define fields class
  // @param {Object}
  form.fieldsClass = {...(copy.fieldsClass || {})};

  // Define fields style
  // @param {Object}
  form.fieldsStyle = {...(copy.fieldsStyle || {})};

  // Define values
  // @param {Array}
  form.values = [...(copy.values || [])];

  // Define values class
  // @param {Object}
  form.valuesClass = {...(copy.valuesClass || {})};

  // Define values style
  // @param {Object}
  form.valuesStyle = {...(copy.valuesStyle || {})};

  // Define events
  // @param {Funtion}
  for (const e in copy) {
    if (typeof copy[e] === 'function' && e.match(/^on[A-Z][A-Za-z]+/)) {
      form[e] = copy[e];
    }
  }

  // Define copy
  // @param {Boolean}
  Object.defineProperty(form, 'copy', {
    value: self.data.clone(form)
  });

  // Define user
  // @param {Object}
  Object.defineProperty(form, 'user', {
    get: (): any => self.data.user
  });

  // Define http
  // @param {Object}
  Object.defineProperty(form, 'http', {
    get: (): any => self.data.http
  });

  // Define i18n
  // @param {Object}
  Object.defineProperty(form, 'i18n', {
    get: (): any => self.data.i18n
  });

  // Define menu
  // @param {Object}
  Object.defineProperty(form, 'menu', {
    get: (): any => self.data.menu
  });

  // Define page
  // @param {Object}
  Object.defineProperty(form, 'page', {
    get: (): any => self.data.page
  });

  // Define self
  // @param {Object}
  Object.defineProperty(form, 'self', {
    get: (): any => self
  });

  // Define open
  form.open = async (open: any) => await self.data.page.modal({component: FormComponent, componentProps: {form: open}});

  if (form.self.modal?.dismiss) {
    form.onFinish = (params: any) => form.self.modal.dismiss(params);
  }

  const auth = form.user.access.auth || '';
  form.uses = form.meta[auth]?.uses || [];
  if (form.meta[auth]?.hide?.length) {
    form.fields = form.fields.filter((i: any) => !form.meta[auth].hide.includes(i.name));
  }
  if (form.meta[auth]?.show?.length) {
    form.fields = form.fields.filter((i: any) => form.meta[auth].show.includes(i.name));
  }

  //
  // Search
  //

  // Define search
  if (form.type === 'search') {
    form.header = [];
    form.footer = [];
    form.navbar = [];
    form.fields = [];
    form.values = [];

    form.filterClass['hide'] = true;
  } else {
    form.filter = [];
    form.values = [];
  }

  if (form.type === 'update' || form.type === 'create') {
    form.header = [];
    form.footer = [];
    form.navbar = [];
  }

  //
  // Header
  //

  // Define header
  if (!form.header.length) {
    form.header.push({name: 'header', type: 'header'});
    if (!form.self.modal) {
      form.header.push({name: 'header', type: 'button', class: {circle: true, 'ion-hide-lg-up': true}});
    } else {
      form.header.push({name: 'cancel', type: 'button', class: {circle: true}});
    }
  }

  //
  // Search
  //

  // Define search: search
  if (form.type === 'search') {
    form.navbar.push({name: 'search', type: 'search'});
  }

  // Define button: filter
  if (form.type === 'search' && form.uses.includes('filter')) {
    form.navbar.push({name: 'filter', type: 'button', class: {circle: true}});
  }

  // Define expand: expand
  if (form.type === 'search') {
    form.navbar.push({name: 'expand', type: 'expand'});
  }

  // Define button: create
  if (form.type === 'search' && form.uses.includes('create')) {
    form.navbar.push({name: 'create', type: 'button', class: {circle: true}});
  }

  // Define fields
  if (form.type === 'search' && form.filter.length) {
    for (const item of form.filter) {
      item.onInput = () => form.self.trigger('form.onStart');
    }
  }

  //
  // Update
  //

  // Define button: download
  if (form.type === 'update' && form.uses.includes('download')) {
    form.navbar.push({name: 'download', type: 'button', class: {circle: true}});
  }

  // Define button: print
  if (form.type === 'update' && form.uses.includes('print') && typeof navigator.share === 'undefined') {
    form.navbar.push({name: 'print', type: 'button', class: {circle: true}});
  }

  // Define button: share
  if (form.type === 'update' && form.uses.includes('share') && typeof navigator.share !== 'undefined') {
    form.navbar.push({name: 'share', type: 'button', class: {circle: true}});
  }

  // Define button: sendmail
  if (form.type === 'update' && form.uses.includes('sendmail')) {
    form.navbar.push({name: 'sendmail', type: 'button', class: {circle: true}});
  }

  // Define expand: expand
  if (form.type === 'update' && form.uses.includes('delete')) {
    form.navbar.push({name: 'expand', type: 'expand'});
  }

  // Define button: delete
  if (form.type === 'update' && form.uses.includes('delete')) {
    form.navbar.push({name: 'delete', type: 'button', class: {circle: true}});
  }

  // Define fields
  if (form.type === 'update' && form.uses.includes('select') && form.fields.length) {
    form.fields = setItemsToReadonly(form.fields);
  }

  // Define footer
  if (form.type === 'update' && form.uses.includes('update') && form.fields.length) {
    form.footer = [];
    form.footer.push({name: 'cancel', type: 'button'});
    form.footer.push({name: 'submit', type: 'button'});
  }

  //
  // Create
  //

  // Define create fields
  if (form.type === 'create' && form.uses.includes('select') && form.fields.length) {
    form.fields = setItemsToReadonly(form.fields);
  }

  // Define create footer
  if (form.type === 'create' && form.uses.includes('create') && form.fields.length) {
    form.footer = [];
    form.footer.push({name: 'cancel', type: 'button'});
    form.footer.push({name: 'submit', type: 'button'});
  }

  //
  // Finish
  //

  self.form = form;

  // Define items
  for (const t of ['header', 'footer', 'navbar', 'filter', 'fields', 'values']) {
    form[t] = form[t].map((i: any) => setItem({form, item: i}));
  }

  // Define $init
  // @param {Object}
  Object.defineProperty(form, '$init', {
    get: (): any => true
  });

  // Update form
  Object.keys(form).forEach((k: any) => (typeof form[k] === 'undefined' ? delete form[k] : {}));

  // Start
  self.trigger('form.onStart');

  // Return form
  return form;
}

/***********************************************************************************************************************
 *** Set Item
 ********************************************************************************************************************/

function setItem({form, item}: any): any {
  const copy: any = {...item};

  // Define item
  item = {};

  // Define name
  // @param {String}
  item.name = typeof copy.name === 'string' ? copy.name : undefined;
  if (!item.name) {
    throw new Error('Item name is required');
  }

  // Define type
  // @param {String}
  item.type = typeof copy.type === 'string' ? copy.type : undefined;
  if (!item.type) {
    throw new Error('Item type is required');
  }

  // Define text
  // @param {String|Object}
  item.text = typeof copy.text === 'string' ? {title: copy.text} : copy.text || undefined;

  // Define icon
  // @param {String|Object}
  item.icon = typeof copy.icon === 'string' ? {image: copy.icon} : copy.icon || undefined;

  // Define hide
  // @param {Boolean}
  item.hide = typeof copy.hide === 'boolean' ? copy.hide : undefined;

  // Define size
  // @param {String}
  item.size = typeof copy.size === 'number' ? `${copy.size}%` : copy.size || undefined;

  // Define slot
  // @param {String}
  item.slot = typeof copy.slot === 'string' ? copy.slot : undefined;

  // Define case
  // @param {String}
  item.case = typeof copy.case === 'string' ? copy.case : undefined;

  // Define mask
  // @param {String}
  item.mask = typeof copy.mask === 'string' ? copy.mask : undefined;

  // Define data
  // @param {Object}
  item.data = typeof copy.data === 'object' ? copy.data : undefined;

  // Define path
  // @param {String}
  item.path = copy.path ? `${copy.path.split('.').slice(0, -1).join('.')}.${copy.name}.$${copy.type}` : `${form.name}.$${form.type}.${copy.name}.$${copy.type}`;

  // Define require
  // @param {Boolean}
  item.require = typeof copy.require === 'boolean' ? copy.require : undefined;

  // Define pattern
  // @param {RegEx}
  item.pattern = typeof copy.pattern === 'string' ? new RegExp(copy.pattern) : copy.pattern || undefined;

  // Define max
  // @param {Number}
  item.max = typeof copy.max === 'number' ? copy.max : undefined;

  // Define min
  // @param {Number}
  item.min = typeof copy.min === 'number' ? copy.min : undefined;

  // Define readonly
  // @param {Boolean}
  item.readonly = typeof copy.readonly === 'boolean' ? copy.readonly : undefined;

  // Define disabled
  // @param {Boolean}
  item.disabled = typeof copy.disabled === 'boolean' ? copy.disabled : undefined;

  // Define class
  // @param {Object}
  item.class = {...(copy.class || {})};

  // Define style
  // @param {Object}
  item.style = {...(copy.style || {})};

  // Define items
  // @param {Array}
  item.items = typeof copy.items === 'object' && Array.isArray(copy.items) ? [...copy.items] : undefined;

  // Define events
  // @param {Funtion}
  for (const e in copy) {
    if (typeof copy[e] === 'function' && e.match(/^on[A-Z][A-Za-z]+/)) {
      item[e] = copy[e];
    }
  }

  // Define $ctrl
  // @param {Object}
  Object.defineProperty(item, '$ctrl', {
    value: {},
    writable: true,
    enumerable: false
  });

  // Define default events by type
  if (item.type === 'array' || item.type === 'group') {
  } else if (item.type === 'id') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text'};
  } else if (item.type === 'text') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text'};
  } else if (item.type === 'textarea') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text', control: 'textarea'};
  } else if (item.type === 'richtext') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text', control: 'textarea'};
  } else if (item.type === 'decimal') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'number', currentInputMode: 'decimal'};
  } else if (item.type === 'integer') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'number', currentInputMode: 'numeric'};
  } else if (item.type === 'percent') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'number', currentInputMode: 'decimal'};
  } else if (item.type === 'currency') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'number', currentInputMode: 'decimal'};
  } else if (item.type === 'quantity') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'number', currentInputMode: 'decimal'};
  } else if (item.type === 'date') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'datetime') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'time') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'year') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'year-month') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'search') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text'};
  } else if (item.type === 'select') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'select', currentInputMode: 'text', popover: 'selector'};
  } else if (item.type === 'switch') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'boolean', currentInputMode: 'text'};
  } else if (item.type === 'toggle') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'boolean', currentInputMode: 'text'};
  } else if (item.type === 'attachment') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'document') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'image') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'audio') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'video') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'file') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'selfie') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'website') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'url'};
  } else if (item.type === 'address') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'object', currentInputMode: 'text', popover: 'location'};
  } else if (item.type === 'phone') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'tel'};
  } else if (item.type === 'email') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'email'};
  } else if (item.type === 'color') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text', popover: 'colorize'};
  } else if (item.type === 'username') {
    item.$ctrl = {contentInput: 'text', currentInputType: 'string', currentInputMode: 'text'};
  } else if (item.type === 'password') {
    item.$ctrl = {contentInput: 'password', currentInputType: 'string', currentInputMode: 'text'};
  } else if (item.type === 'expand') {
  } else if (item.type === 'header') {
  } else if (item.type === 'footer') {
  } else if (item.type === 'legend') {
  } else if (item.type === 'values') {
  } else if (item.type === 'button') {
  } else {
    throw new Error('Item type is invalid');
  }

  // Define control content
  item.$ctrl.content = true;
  item.$ctrl.contentTitle = item.text?.title || form.i18n.text(`${item.path}.$content-title`) || '';
  item.$ctrl.contentLabel = item.text?.label || form.i18n.text(`${item.path}.$content-label`) || '';
  item.$ctrl.contentPlace = item.text?.place || form.i18n.text(`${item.path}.$content-place`) || '';
  item.$ctrl.contentNotes = item.text?.notes || form.i18n.text(`${item.path}.$content-notes`) || '';
  item.$ctrl.contentColor = item.text?.color || form.i18n.text(`${item.path}.$content-color`) || '';
  item.$ctrl.contentClass = item.text?.class || form.i18n.text(`${item.path}.$content-class`) || {};
  item.$ctrl.contentStyle = item.text?.style || form.i18n.text(`${item.path}.$content-style`) || {};

  // Define control picture
  item.$ctrl.picture = true;
  item.$ctrl.pictureImage = item.icon?.image || form.i18n.text(`${item.path}.$picture-image`) || '';
  item.$ctrl.pictureTitle = item.icon?.title || form.i18n.text(`${item.path}.$picture-title`) || '';
  item.$ctrl.pictureColor = item.icon?.color || form.i18n.text(`${item.path}.$picture-color`) || '';
  item.$ctrl.pictureClass = item.icon?.class || form.i18n.text(`${item.path}.$picture-class`) || {};
  item.$ctrl.pictureStyle = item.icon?.style || form.i18n.text(`${item.path}.$picture-style`) || {};
  item.$ctrl.pictureImageIsIcon = () => isIcon(item.$ctrl.pictureImage);

  // Define control trigger
  item.$ctrl.trigger = true;
  item.$ctrl.triggerImage = item.icon?.image || form.i18n.text(`${item.path}.$trigger-image`) || '';
  item.$ctrl.triggerTitle = item.icon?.title || form.i18n.text(`${item.path}.$trigger-title`) || '';
  item.$ctrl.triggerColor = item.icon?.color || form.i18n.text(`${item.path}.$trigger-color`) || '';
  item.$ctrl.triggerClass = item.icon?.class || form.i18n.text(`${item.path}.$trigger-class`) || {};
  item.$ctrl.triggerStyle = item.icon?.style || form.i18n.text(`${item.path}.$trigger-style`) || {};
  item.$ctrl.triggerImageIsIcon = () => isIcon(item.$ctrl.triggerImage);

  // Define item classes
  item.class[`flb-item-type-${item.type}`] = true;
  item.class[`flb-item-name-${item.name}`] = true;
  if (!item.class['button'] && ['button', 'values'].includes(item.type)) {
    item.class['button'] = true;
  }
  if (!item.class['button'] && item.$ctrl.contentInput && item.onClick) {
    item.class['button'] = true;
  }
  if (!item.class['button'] && item.$ctrl.contentInput) {
    item.class['action'] = true;
  }
  if (item.size) {
    item.style['width'] = item.size;
  }

  // Define default events by type and name
  if (item.type === 'button' && item.name === 'header') {
    item.onClick = item.onClick || (({form}: any) => form.menu.toggle(true));
  } else if (item.type === 'search' && item.name === 'search') {
    item.onInput = item.onInput || itemSearchActionInput;
  } else if (item.type === 'values' && item.name === 'select') {
    item.onClick = item.onClick || itemSelectValuesClick;
  } else if (item.type === 'button' && item.name === 'filter') {
    item.onClick = item.onClick || itemFilterButtonClick;
  } else if (item.type === 'button' && item.name === 'create') {
    item.onClick = item.onClick || itemCreateButtonClick;
  } else if (item.type === 'button' && item.name === 'delete') {
    item.onClick = item.onClick || itemDeleteButtonClick;
  } else if (item.type === 'button' && item.name === 'cancel') {
    item.onClick = item.onClick || itemCancelButtonClick;
  } else if (item.type === 'button' && item.name === 'submit') {
    item.onClick = item.onClick || itemSubmitButtonClick;
  } else if (item.type === 'button' && item.name === 'download') {
    item.onClick = item.onClick || itemDownloadButtonClick;
  } else if (item.type === 'button' && item.name === 'print') {
    item.onClick = item.onClick || itemPrintButtonClick;
  } else if (item.type === 'button' && item.name === 'share') {
    item.onClick = item.onClick || itemShareButtonClick;
  } else if (item.type === 'button' && item.name === 'sendmail') {
    item.onClick = item.onClick || itemSendmailButtonClick;
  }

  // Define default events by control
  if (item.$ctrl.control === 'textarea') {
    item.onRenderControl = getTextareaControl;
  }

  // Define default events by popover
  if (item.$ctrl.popover === 'colorize') {
    item.onRenderPopover = getColorizePopover;
  } else if (item.$ctrl.popover === 'datetime') {
    item.onRenderPopover = getDatetimePopover;
  } else if (item.$ctrl.popover === 'document') {
    item.onRenderPopover = getDocumentPopover;
  } else if (item.$ctrl.popover === 'location') {
    item.onRenderPopover = getLocationPopover;
  } else if (item.$ctrl.popover === 'selector') {
    item.onRenderPopover = getSelectorPopover;
  }

  // Define title
  // @param {Mixed}
  Object.defineProperty(item, 'title', {
    get: (): any => item.$ctrl.contentTitle,
    set: (title: any): any => (item.$ctrl.contentTitle = title)
  });

  // Define label
  // @param {Mixed}
  Object.defineProperty(item, 'label', {
    get: (): any => item.$ctrl.contentLabel,
    set: (label: any): any => (item.$ctrl.contentLabel = label)
  });

  // Define place
  // @param {Mixed}
  Object.defineProperty(item, 'place', {
    get: (): any => item.$ctrl.contentPlace,
    set: (place: any): any => (item.$ctrl.contentPlace = place)
  });

  // Define notes
  // @param {Mixed}
  Object.defineProperty(item, 'notes', {
    get: (): any => item.$ctrl.contentNotes,
    set: (notes: any): any => (item.$ctrl.contentNotes = notes)
  });

  // Define value
  // @param {Mixed}
  Object.defineProperty(item, 'value', {
    get: (): any => item.$ctrl.currentValue,
    set: (value: any): any => setItemValue({form, item, value})
  });

  // Define $init
  // @param {Object}
  Object.defineProperty(item, '$init', {
    get: (): any => true
  });

  // Update item
  Object.keys(item).forEach((k: any) => (typeof item[k] === 'undefined' ? delete item[k] : {}));

  // Setup
  form.self.trigger('item.onSetup', item);

  // Return item
  return item;
}

/***********************************************************************************************************************
 *** Set Item Value
 ********************************************************************************************************************/

function setItemValue({form, item, $event, action, value}: any): any {
  if (action === 'setup') {
    return true;
  }
  if (action === 'click' && item.disabled) {
    return false;
  }
  if (action === 'click') {
    item.disabled = true;
  }
  if (action === 'enter' && (item.disabled || item.readonly)) {
    return false;
  }
  if (action === 'leave' && (item.disabled || item.readonly)) {
    return false;
  }
  if (action === 'input' && (item.disabled || item.readonly)) {
    return false;
  }

  const format: any = {from: action, type: item.type, case: item.case, mask: item.mask, max: item.max, min: item.min, pattern: item.pattern};

  item.$ctrl.currentEvent = $event;

  // Define field
  if (item.type === 'values' || item.type === 'header') {
    if (action === 'setup' || !action) {
      item.$ctrl.currentValue = value;
      item.$ctrl.contentTitle = item.$ctrl.currentValue?.title || item.$ctrl.contentTitle;
      item.$ctrl.contentLabel = item.$ctrl.currentValue?.label || item.$ctrl.contentLabel;
      item.$ctrl.contentPlace = item.$ctrl.currentValue?.place || item.$ctrl.contentPlace;
      item.$ctrl.contentNotes = item.$ctrl.currentValue?.notes || item.$ctrl.contentNotes;
      item.$ctrl.contentColor = item.$ctrl.currentValue?.color || item.$ctrl.contentColor;
      item.$ctrl.contentClass = item.$ctrl.currentValue?.class || item.$ctrl.contentClass;
      item.$ctrl.contentStyle = item.$ctrl.currentValue?.style || item.$ctrl.contentStyle;
      item.$ctrl.pictureImage = item.$ctrl.currentValue?.image || item.$ctrl.pictureImage;
    }
    return;
  }

  // Define value for array type
  if (item.type === 'array') {
    const arrayItems: any = [];
    const arrayValue: any = [];
    const arrayTitle: any = [];
    for (const v in value || []) {
      const groupItems: any = item.items.map((i: any) => setItem({form, item: {...i, path: item.path}}));
      arrayItems.push(groupItems);
      arrayValue.push(setBodyValue(form, groupItems, value[v]));
    }
    if (arrayItems.length === arrayValue.length) {
      const groupItems: any = item.items.map((i: any) => setItem({form, item: {...i, path: item.path}}));
      arrayTitle.push(groupItems);
    }
    item.$ctrl.currentItems = arrayItems;
    item.$ctrl.currentValue = arrayValue;
    item.$ctrl.currentTitle = arrayTitle;
  }

  // Define value for group type
  if (item.type === 'group') {
    const groupItems: any = item.items.map((i: any) => setItem({form, item: {...i, path: item.path}}));
    const groupValue: any = setBodyValue(form, groupItems, value);
    item.$ctrl.currentItems = groupItems;
    item.$ctrl.currentValue = groupValue;
  }

  // Define value for string input type
  if (item.$ctrl.currentInputType === 'string') {
    // if (!action && !value) {
    //   return;
    // }

    if (action === 'setup' || !action) {
      item.$ctrl.currentValue = form.i18n.stringValue(value, format);
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentValue, format);
    } else if (action === 'click') {
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentValue, format);
    } else if (action === 'enter') {
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentValue, format);
    } else if (action === 'leave') {
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentValue, format);
    } else if (action === 'input') {
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentEvent.target.value, format);
      item.$ctrl.currentValue = form.i18n.stringValue(item.$ctrl.currentInput, format);
    }
  }

  // Define value for number input type
  if (item.$ctrl.currentInputType === 'number') {
    if (action === 'setup' || !action) {
      item.$ctrl.currentValue = form.i18n.numberValue(value, format);
      item.$ctrl.currentInput = form.i18n.numberInput(item.$ctrl.currentValue, format);
    } else if (action === 'click') {
      item.$ctrl.currentInput = form.i18n.numberInput(item.$ctrl.currentValue, format);
    } else if (action === 'enter') {
      item.$ctrl.currentInput = form.i18n.numberInput(item.$ctrl.currentValue, format);
    } else if (action === 'leave') {
      item.$ctrl.currentInput = form.i18n.numberInput(item.$ctrl.currentValue, format);
    } else if (action === 'input') {
      item.$ctrl.currentInput = form.i18n.numberInput(item.$ctrl.currentEvent.target.value, format);
      item.$ctrl.currentValue = form.i18n.numberValue(item.$ctrl.currentInput, format);
    }
  }

  // Define value for object input type
  if (item.$ctrl.currentInputType === 'object') {
    if (action === 'setup' || !action) {
      item.$ctrl.currentValue = form.i18n.objectValue(value, format);
      item.$ctrl.currentInput = form.i18n.objectInput(item.$ctrl.currentValue, format);
    } else {
      item.$ctrl.currentInput = form.i18n.objectInput(item.$ctrl.currentValue, format);
    }
  }

  // Define value for select input type
  if (item.$ctrl.currentInputType === 'select') {
    item.data = {...(item.data || {})};
    if (typeof item.data.readonly === 'undefined') {
      item.data.readonly = item.readonly || false;
    }
    if (typeof item.data.editable === 'undefined') {
      item.data.editable = false;
    }
    if (typeof item.data.populate === 'undefined' && !item.data.editable) {
      item.data.populate = false;
    }
    if (!item.data.values && window.formValues[`${item.path}`]) {
      item.data.values = window.formValues[`${item.path}`];
    }
    if (!item.data.values && item.data.populate) {
      item.data.values = [];
      form.http
        .request({lookup: form.rest, data: {index: item.name}})
        .then((values: any) => {
          window.formValues[`${item.path}`] = values;
          item.data.values = values;
          setValue();
        })
        .catch(console.warn);
    }
    function setValue() {
      if (typeof value === 'object' && value._id && value.name) {
        item.$ctrl.currentValue = value._id;
        item.$ctrl.currentInput = value.name;
        value = value._id;
      } else {
        const match: any = (item.data.values || []).find((v: any) => JSON.stringify({['_']: v.value}) === JSON.stringify({['_']: value}));
        item.$ctrl.currentValue = match?.value;
        item.$ctrl.currentInput = match?.title;
      }
    }
    if (!item.data.editable) {
      if (action === 'setup' || !action) {
        setValue();
      }
    } else if (action === 'setup' || !action) {
      item.$ctrl.currentValue = form.i18n.stringValue(value, format);
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentValue, format);
    } else if (action === 'click') {
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentValue, format);
    } else if (action === 'enter') {
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentValue, format);
    } else if (action === 'leave') {
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentValue, format);
    } else if (action === 'input') {
      item.$ctrl.currentInput = form.i18n.stringInput(item.$ctrl.currentEvent.target.value, format);
      item.$ctrl.currentValue = form.i18n.stringValue(item.$ctrl.currentInput, format);
    }
  }

  // Define value for boolean input type
  if (item.$ctrl.contentInput && item.$ctrl.currentInputType === 'boolean') {
    if (action === 'setup' || !action) {
      item.$ctrl.currentValue = value ? true : false;
    } else if (action === 'click' && !item.readonly) {
      item.$ctrl.currentValue = item.$ctrl.currentValue ? false : true;
    } else if (action === 'input' && !item.readonly) {
      item.$ctrl.currentValue = item.$ctrl.currentValue ? false : true;
    } else {
      item.$ctrl.currentValue = item.$ctrl.currentValue ? true : false;
    }
    const t = item.$ctrl.currentValue ? 'y' : 'n';
    item.$ctrl.currentInput = form.i18n.text(`${item.path}.$content-value-${t}`);
    item.$ctrl.triggerImage = form.i18n.text(`${item.path}.$trigger-image-${t}`) || item.$ctrl.triggerImage || '';
    item.$ctrl.triggerTitle = form.i18n.text(`${item.path}.$trigger-title-${t}`) || item.$ctrl.triggerTitle || '';
    item.$ctrl.triggerColor = form.i18n.text(`${item.path}.$trigger-color-${t}`) || item.$ctrl.triggerColor || '';
    item.$ctrl.triggerClass = form.i18n.text(`${item.path}.$trigger-class-${t}`) || item.$ctrl.triggerClass || {};
    item.$ctrl.triggerStyle = form.i18n.text(`${item.path}.$trigger-style-${t}`) || item.$ctrl.triggerStyle || {};
  }

  // Verify value
  if (!item.$ctrl.currentValue) {
    if (['leave', 'input'].includes(action) && item.require) {
      item.$ctrl.contentNotes = form.i18n.text(`${item.path}.$content-alert`);
      item.$ctrl.currentValid = false;
    } else {
      item.$ctrl.contentNotes = form.i18n.text(`${item.path}.$content-notes`);
      item.$ctrl.currentValid = true;
    }
  } else {
    if (['leave', 'input'].includes(action) && !form.i18n.isValid(item.$ctrl.currentValue, format)) {
      item.$ctrl.contentNotes = form.i18n.text(`${item.path}.$content-error`);
      item.$ctrl.currentValid = false;
    } else {
      item.$ctrl.contentNotes = form.i18n.text(`${item.path}.$content-notes`);
      item.$ctrl.currentValid = true;
    }
  }

  // Define array
  if (item.type === 'array' && item.readonly) {
    item.hide = item.$ctrl.currentValue.length ? false : true;
  }

  // Define array
  if (item.type === 'group' && item.readonly) {
    item.hide = Object.keys(item.$ctrl.currentValue).length ? false : true;
  }

  // Define id
  if (item.type === 'id' && typeof item.hide === 'undefined') {
    item.hide = true;
  }

  // Define control
  if (item.$ctrl.control === 'textarea') {
    item.$ctrl.trigger = !item.readonly;
  }

  // Define popover
  if (item.$ctrl.popover === 'colorize') {
    item.$ctrl.triggerStyle['color'] = item.$ctrl.currentValue ? item.$ctrl.currentValue : undefined;
  } else if (item.$ctrl.popover === 'datetime') {
    item.$ctrl.trigger = !item.readonly || (item.$ctrl.currentValue && item.$ctrl.currentValid) ? true : false;
  } else if (item.$ctrl.popover === 'document') {
    item.$ctrl.trigger = !item.readonly || (item.$ctrl.currentValue && item.$ctrl.currentValid) ? true : false;
  } else if (item.$ctrl.popover === 'location') {
    item.$ctrl.trigger = !item.readonly || (item.$ctrl.currentValue && item.$ctrl.currentValid) ? true : false;
  } else if (item.$ctrl.popover === 'selector') {
    item.$ctrl.trigger = !item.readonly;
  }

  // Verify item trigger: website, phone, email
  if (['website', 'phone', 'email'].includes(item.type)) {
    item.$ctrl.trigger = item.$ctrl.currentValue && item.$ctrl.currentValid ? true : false;
  }

  // Verify action click
  if (action === 'click' && !item.class['button']) {
    if (item.$ctrl.popover) {
      item.$ctrl.popoverOpen = !item.$ctrl.popoverOpen;
    }

    if (item.type === 'website' && item.$ctrl.currentValue && item.$ctrl.currentValid) {
      window.open(`${item.$ctrl.currentValue}`, '_system');
    }

    if (item.type === 'phone' && item.$ctrl.currentValue && item.$ctrl.currentValid) {
      window.open(`https://wa.me/${item.$ctrl.currentValue}`, '_system');
    }

    if (item.type === 'email' && item.$ctrl.currentValue && item.$ctrl.currentValid) {
      window.open(`mailto://${item.$ctrl.currentValue}`, '_system');
    }

    if (item.type === 'username') {
      item.$ctrl.triggerImage = item.$ctrl.contentInput === 'text' ? 'eye' : 'person';
      item.$ctrl.contentInput = item.$ctrl.contentInput === 'text' ? 'password' : 'text';
    }

    if (item.type === 'password') {
      item.$ctrl.triggerImage = item.$ctrl.contentInput === 'text' ? 'eye' : 'eye-off';
      item.$ctrl.contentInput = item.$ctrl.contentInput === 'text' ? 'password' : 'text';
    }
  }

  if (action === 'input' && item.$ctrl.currentEvent?.target) {
    item.$ctrl.currentEvent.target.value = item.$ctrl.currentInput;
  }

  if (action === 'input' && item.$ctrl.currentEvent?.keyCode === 13 && item.$ctrl.contentInput) {
    const submit = form.footer.find((i: any) => i.name === 'submit' && i.type === 'button');
    if (submit) {
      form.self.trigger('item.onClick', submit, item.$ctrl.currentEvent);
    }
  }
}

/***********************************************************************************************************************
 *** Set Body Value
 ********************************************************************************************************************/

function setBodyValue(form: any, group: any[] = [], value: any = undefined): any {
  const result: any = {};
  for (const item of group) {
    if (item.type === 'array' || item.type === 'group' || item.$ctrl.contentInput) {
      Object.defineProperty(result, item.name, {
        enumerable: true,
        get: (): any => item.value,
        set: (value: any) => (item.value = value)
      });
      result[item.name] = value?.[item.name] || undefined;
    }
  }
  return result;
}

/***********************************************************************************************************************
 *** Set Slot Value
 ********************************************************************************************************************/

function setSlotValue(form: any, value: any = {}): any {
  const flatMap = (items: any, str = '', fresh: any = {}, path = '') => {
    for (const item of items) {
      if (item.type === 'array') {
        flatMap(item.items || [], `${str}${item.name}.0.`, fresh, `${str}${item.name}.`);
        continue;
      }
      if (item.type === 'group') {
        flatMap(item.items, `${str}${item.name}.`, fresh, `${str}${item.name}.`);
        continue;
      }
      if (item.type === 'select') {
        item.items = item.items || [
          {name: '_id', type: 'id'},
          {name: 'name', type: 'text', slot: item.slot || 'label'}
        ];
        flatMap(item.items, `${str}${item.name}.`, fresh, `${str}${item.name}.`);
        continue;
      }
      if (item.slot) {
        fresh[item.slot] = fresh[item.slot] || [];
        fresh[item.slot].push({
          path: `${str}${item.name}`,
          name: `${path}${item.name}`,
          type: item.type,
          title: form.i18n.text(`${form.name}.${path}${item.name}.$content-title`),
          value: true
        });
      }
    }
    return fresh;
  };

  if (!form._slot) {
    if (form.copy.fields.length) {
      const fields: any = [...form.copy.fields];
      form._slot = flatMap(fields);
    } else {
      const fields: any = [];
      fields.push({name: 'title', type: 'text', slot: 'title'});
      fields.push({name: 'label', type: 'text', slot: 'label'});
      fields.push({name: 'image', type: 'image', slot: 'image'});
      form._slot = flatMap(fields);
    }
  }

  const slots: any = {...form._slot};
  const plain: any = form.self.data.plain(value);

  // Define result
  const result: any = {};

  // Define index
  result.index = value._id || value.id || '';

  // Define value
  result.value = value;

  // Define title
  const title: any = [];
  for (const item of slots.title || []) {
    let value: any = plain[item.path];
    if (typeof value === 'number') {
      value = form.i18n.numberInput(value, {type: item.type});
    }
    if (typeof value === 'string') {
      value = form.i18n.stringInput(value, {type: item.type});
    }
    if (typeof value === 'object') {
      value = form.i18n.objectInput(value, {type: item.type});
    }
    if (value) {
      title.push(value);
    }
  }
  result.title = title.join(', ');

  // Define label
  const label: any = [];
  for (const item of slots.label || []) {
    let value: any = plain[item.path];
    if (typeof value === 'number') {
      value = form.i18n.numberInput(value, {type: item.type});
    }
    if (typeof value === 'string') {
      value = form.i18n.stringInput(value, {type: item.type});
    }
    if (typeof value === 'object') {
      value = form.i18n.objectInput(value, {type: item.type});
    }
    if (value) {
      label.push(value);
    }
  }
  result.label = label.join(', ');

  // Define notes
  const notes: any = [];
  for (const item of slots.notes || []) {
    let value: any = plain[item.path];
    if (typeof value === 'number') {
      value = form.i18n.numberInput(value, {type: item.type});
    }
    if (typeof value === 'string') {
      value = form.i18n.stringInput(value, {type: item.type});
    }
    if (typeof value === 'object') {
      value = form.i18n.objectInput(value, {type: item.type});
    }
    if (value) {
      let block = '';
      block += `<div class="notes">`;
      block += item.title ? `<span class="field ion-hide-lg-down">${item.title}: </span>` : '';
      block += item.value ? `<span class="value">${value}</span>` : '';
      block += `</div>`;
      notes.push(block);
    }
  }
  result.notes = notes.join('');

  // Define image
  const image: any = [];
  for (const item of slots.image || []) {
    let value: any = plain[item.path];
    if (typeof value === 'number') {
      value = form.i18n.numberInput(value, {type: item.type});
    }
    if (typeof value === 'string') {
      value = form.i18n.stringInput(value, {type: item.type});
    }
    if (typeof value === 'object') {
      value = form.i18n.objectInput(value, {type: item.type});
    }
    if (value) {
      image.push(value);
    }
  }
  result.image = image.shift() || undefined;

  Object.keys(result).forEach((k: any) => (typeof result[k] === 'undefined' ? delete result[k] : {}));
  return result;
}

/***********************************************************************************************************************
 *** Get Colorize Popover
 ********************************************************************************************************************/

function getColorizePopover(form: any, item: any, $el: any): any {
  if ($el.loaded) {
    return $el.loaded;
  }
  $el.loaded = true;

  // Define options
  const options: any = {};
  options.colors =
    '#000000,#4c4c4c,#666666,#808080,#999999,#b3b3b3,#cccccc,#e6e6e6,#f2f2f2,#ffffff,#d4dae4,#b0b8cd,#949db1,#727a8c,#5e6677,#3f4757,#1d2534,#ffcdd2,#fe9998,#f35c4e,#e94633,#d73c2d,#ca3626,#bb2b1a,#f9e6ad,#f4d679,#edb90f,#eaa100,#ea8f00,#ea7e00,#ea5d00,#bce4ce,#90d2af,#33b579,#36955f,#247346,#1d5b38,#17492d,#bdf0e9,#92e7dc,#02d7c5,#11b3a5,#018b80,#026b60,#024f43,#b3e5fc,#81d4fa,#29b6f6,#039be5,#0288d1,#0277bd,#01579b,#aec1ff,#88a3f9,#5874cd,#2349ae,#163fa2,#083596,#002381,#c5c0da,#9f97c1,#7e6bad,#584a8f,#4f4083,#473776,#3a265f,#d6bdcc,#c492ac,#a9537c,#963a64,#81355a,#6e3051,#4c2640,#d2c5c1,#b4a09a,#826358,#624339,#5d4037,#4e342e,#3e2723';
  options.colors = options.colors.split(',');

  // Define popover
  item.$ctrl.popoverData = item.$ctrl.currentValue;

  // Define content
  const content: any = document.createElement('div');
  content.className = 'flb-item-popover-colorize';
  $el.appendChild(content);

  // Define content input
  const contentInput: any = document.createElement('input');
  contentInput.className = 'input';
  contentInput.tabIndex = 1;
  contentInput.type = 'color';
  contentInput.value = item.$ctrl.popoverData;
  contentInput.placeholder = form.i18n.text(`${form.name}.${item.name}.$popover.$colorize-input`);
  contentInput.onchange = () => (item.$ctrl.popoverData = contentInput.value);
  content.appendChild(contentInput);

  // Define content color
  for (const color of options.colors) {
    const contentColor: any = document.createElement('div');
    contentColor.className = 'color';
    contentColor.tabIndex = 1;
    contentColor.style.backgroundColor = color;
    contentColor.onclick = () => {
      contentInput.value = color;
      item.$ctrl.popoverData = contentInput.value;
    };
    content.appendChild(contentColor);
  }

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Datetime Popover
 ********************************************************************************************************************/

function getDatetimePopover(form: any, item: any, $el: any): any {
  if ($el.loaded) {
    return $el.loaded;
  }
  $el.loaded = true;

  // Define options
  const options: any = {
    ['date']: {presentation: 'date'},
    ['datetime']: {presentation: 'date-time'},
    ['time']: {presentation: 'time'},
    ['year']: {presentation: 'year'},
    ['year-month']: {presentation: 'month-year'}
  };

  // Define popover
  item.$ctrl.popoverData = item.$ctrl.currentValue || form.i18n.stringValue(new Date(), {type: item.type, case: item.case, mask: item.mask, max: item.max, min: item.min, pattern: item.pattern});

  // Define content
  const content: any = document.createElement('div');
  content.className = 'flb-item-popover-datetime';
  $el.appendChild(content);

  // Define content input
  const contentInput: any = document.createElement('ion-datetime');
  contentInput.className = 'input';
  contentInput.size = 'cover';
  contentInput.value = item.$ctrl.popoverData;
  contentInput.locale = form.i18n.config.locale;
  contentInput.presentation = options[item.type]?.presentation || 'date';
  contentInput.showDefaultTimeLabel = false;
  contentInput.addEventListener('ionChange', () => {
    item.$ctrl.popoverData = contentInput.value;
  });
  content.appendChild(contentInput);

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Document Popover
 ********************************************************************************************************************/

function getDocumentPopover(form: any, item: any, $el: any): any {
  if ($el.loaded) {
    return $el.loaded;
  }
  $el.loaded = true;

  // Define options
  const options: any = {
    ['attachment']: {accept: 'application/*'},
    ['document']: {accept: 'application/pdf'},
    ['image']: {accept: 'image/*'},
    ['audio']: {accept: 'audio/*', capture: 'user'},
    ['video']: {accept: 'video/*'},
    ['file']: {accept: '*/*'},
    ['selfie']: {accept: 'image/*', capture: 'user'}
  };

  // Define popover
  item.$ctrl.popoverData = item.$ctrl.currentValue || '';

  // Define content
  const content: any = document.createElement('div');
  content.className = 'flb-item-popover-document';
  $el.appendChild(content);

  // Define content frame
  const contentFrame: any = document.createElement('div');
  contentFrame.className = 'frame';
  contentFrame.style.display = 'none';
  contentFrame.onclick = () => {
    const element: any = document.createElement('input');
    element.style.display = 'none';
    element.type = 'file';
    element.accept = options[item.type]?.accept || '*/*';
    element.capture = options[item.type]?.capture || 'environment';
    element.onchange = contentFetch;
    element.click();
  };
  content.appendChild(contentFrame);

  // Define content click
  const contentClick: any = document.createElement('div');
  contentClick.className = 'click';
  contentClick.style.display = 'none';
  contentClick.onclick = () => {
    const element: any = document.createElement('a');
    element.style.display = 'none';
    element.href = item.$ctrl.popoverData;
    element.target = '_system';
    element.click();
  };
  content.appendChild(contentClick);

  // Define content fetch
  const contentFetch: any = async ($event: any) => {
    try {
      const file: any = $event.target.files[0];
      await form.page.loading({message: item.path});
      const result: any = await form.http.request({upload: form.rest, data: {index: item.name}, form: {file}});
      contentParse(result?.url);
      await form.page.success({message: item.path});
    } catch (error: any) {
      await form.page.warning({message: item.path, error});
    }
  };

  // Define content parse
  const contentParse: any = (value: any = undefined) => {
    if (value) {
      item.$ctrl.popoverData = value;
    }
    const failimg: any = `https://fakeimg.pl/300x300/ffffff/?text=${item.$ctrl.contentPlace}&font_size=18`;
    contentFrame.innerHTML = `<img src="${item.$ctrl.popoverData || failimg}" onerror="this.onerror=null;this.src='${failimg}';" />`;
    contentFrame.style.display = 'block';
    contentClick.innerHTML = `<img src="https://fakeimg.pl/300x30/ffffff/?text=Descargar&font_size=18" />`;
    contentClick.style.display = item.$ctrl.popoverData ? 'block' : 'none';
  };

  // Verify current value
  if (!item.readonly && !item.$ctrl.popoverData) {
    contentFrame.click();
  }
  contentParse();

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Location Popover
 ********************************************************************************************************************/

function getLocationPopover(form: any, item: any, $el: any): any {
  if ($el.loaded) {
    return $el.loaded;
  }
  $el.loaded = true;

  // Define content
  const content: any = document.createElement('div');
  content.className = 'flb-item-popover-location';
  $el.appendChild(content);

  // Define content input
  const contentInput: any = document.createElement('input');
  contentInput.className = 'input';
  contentInput.tabIndex = 1;
  contentInput.type = 'text';
  contentInput.value = item.$ctrl.popoverData;
  contentInput.placeholder = form.i18n.text(`${form.name}.${item.name}.$popover.$location-input`);
  // contentInput.onkeyup = () => {};
  content.appendChild(contentInput);

  // Define content frame
  const contentFrame: any = document.createElement('div');
  contentFrame.className = 'frame';
  content.appendChild(contentFrame);

  // Define content map
  const contentMap: any = new window.formMapLib.Map(contentFrame, {zoom: 14});
  const contentMarker: any = new window.formMapLib.Marker({map: contentMap, draggable: !item.readonly});
  window.formMapLib.event.addListener(contentMarker, 'dragend', () => {
    contentMap.panTo(contentMarker.getPosition());
  });
  if (item.value?.position) {
    contentMarker.setPosition({lat: item.value.position[0], lng: item.value.position[1]});
  } else {
    contentMarker.setPosition({lat: -31.4007206, lng: -64.180734});
  }
  contentMap.panTo(contentMarker.getPosition());

  //this.geocodeLatLng({lat: result.latLng.lat(), lng: result.latLng.lng()});
  // if (item.value?.street) {
  //   data = await loadCurrentPosition();
  //   this.geocodeString(this.value);
  // } else {
  //   data = await loadCurrentPosition();
  // }
  // map.setCenter(data);
  // contentMarker.setPosition(data);

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Selector Popover
 ********************************************************************************************************************/

function getSelectorPopover(form: any, item: any, $el: any): any {
  if ($el.loaded) {
    return $el.loaded;
  }
  $el.loaded = true;

  // Define popover
  item.$ctrl.popoverData = item.$ctrl.currentValue || undefined;

  // Define content
  const content: any = document.createElement('div');
  content.className = 'flb-item-popover-selector';
  $el.appendChild(content);

  // Define content input
  const contentInput: any = document.createElement('input');
  contentInput.className = 'input';
  contentInput.tabIndex = 1;
  contentInput.type = 'text';
  contentInput.value = '';
  contentInput.placeholder = form.i18n.text(`${form.name}.${item.name}.$popover.$selector-input`);
  contentInput.onkeyup = () => contentFetch();
  content.appendChild(contentInput);

  // Define content items
  const contentItems: any = document.createElement('div');
  contentItems.className = 'items';
  content.appendChild(contentItems);

  // Define content fetch
  const contentFetch: any = async () => {
    if (!item.data.values) {
      item.data.values = await form.http.request({lookup: form.rest, data: {index: item.name}});
    }

    let values: any = [...(item.data.values || [])];

    if (contentInput.value) {
      values = values.filter((v: any) => `${v.title || v.label || ''}`.match(new RegExp(`${contentInput.value}`, 'i')));
    }

    contentItems.innerHTML = '';
    for (const value of values || []) {
      let html: any = ``;
      html += `<div class="flb-item-picture">`;
      html += value.image && isIcon(value.image) ? `<ion-icon class="flb-item-picture-image" name="${value.image}" />` : '';
      html += value.image && !isIcon(value.image) ? `<ion-img class="flb-item-picture-image" src="${value.image}" alt="${value.title || ''}" />` : '';
      html += value.color && !value.image ? `<div class="flb-item-picture-image" style="background-color: ${value.color};"></div>` : '';
      html += `</div>`;
      html += `<div class="flb-item-content">`;
      html += value.title ? `<div class="flb-item-content-title">${value.title}</div>` : '';
      html += value.label ? `<div class="flb-item-content-label">${value.label}</div>` : '';
      html += value.badge ? `<div class="flb-item-content-badge">${value.badge}</div>` : '';
      html += value.count ? `<div class="flb-item-content-count">${value.count}</div>` : '';
      html += value.total ? `<div class="flb-item-content-total">${value.total}</div>` : '';
      html += `</div>`;

      const check: any = JSON.stringify({['_']: value.value}) === JSON.stringify({['_']: item.$ctrl.popoverData});
      const contentClick: any = document.createElement('div');
      contentClick.className = 'flb-item flb-item-type-button button' + (check ? ' active' : '');
      contentClick.tabIndex = 1;
      contentClick.innerHTML = html;
      contentClick.onkeyup = (e: any) => (e.keyCode === 13 ? contentClick.click() : contentClick.focus());
      contentClick.onclick = () => {
        item.$ctrl.popoverData = value.value;
        contentFetch();
      };
      contentItems.appendChild(contentClick);
    }
  };
  contentFetch();

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Textarea Control
 ********************************************************************************************************************/

function getTextareaControl(form: any, item: any, $el: any): any {
  if ($el.loaded) {
    return $el.loaded;
  }
  $el.loaded = true;

  // Define content
  const content: any = document.createElement('div');
  content.className = 'flb-item-control-textarea';
  $el.appendChild(content);

  // Define content input
  const contentInput: any = document.createElement('div');
  contentInput.className = 'input';
  contentInput.tabIndex = 1;
  contentInput.innerHTML = item.$ctrl.currentValue || '';
  contentInput.dataset.title = item.$ctrl.contentTitle || '';
  contentInput.dataset.label = item.$ctrl.contentLabel || '';
  contentInput.dataset.place = item.$ctrl.contentPlace || '';
  contentInput.contentEditable = !item.readonly;
  contentInput.onkeyup = ($event: any) => {
    for (const i in contentItemsTypes) {
      contentItemsTypes[i].classList.remove('active');
    }
    const ws: any = window.getSelection();
    for (let i = 0; i < ws.rangeCount; i++) {
      let $s: any = ws.getRangeAt(i).startContainer;
      let $c = 0;
      while ($s?.parentNode && !$event.currentTarget.isEqualNode($s.parentNode) && $c < 100) {
        if (['B', 'I', 'U', 'STRIKE'].includes($s.parentNode.nodeName)) {
          const l = $s.parentNode.nodeName.substring(0, 1).toLowerCase();
          if (contentItemsTypes[l]) {
            contentItemsTypes[l].classList.toggle('active', true);
          }
        }
        $s = $s.parentNode;
        $c++;
      }
    }
  };
  content.appendChild(contentInput);

  // Define content items
  const contentItems: any = document.createElement('div');
  contentItems.className = 'items';
  content.appendChild(contentItems);

  // Define content items types
  const contentItemsTypes: any = {};

  // Define content items: b
  contentItemsTypes['b'] = document.createElement('div');
  contentItemsTypes['b'].className = 'item b';
  contentItemsTypes['b'].innerText = 'B';
  contentItemsTypes['b'].onmousedown = ($event: any) => $event.preventDefault();
  contentItemsTypes['b'].onmouseup = ($event: any) => $event.preventDefault();
  contentItemsTypes['b'].onclick = ($event: any) => ($event.preventDefault(), document.execCommand('bold'));
  contentItems.appendChild(contentItemsTypes['b']);

  // Define content items: i
  contentItemsTypes['i'] = document.createElement('div');
  contentItemsTypes['i'].className = 'item i';
  contentItemsTypes['i'].innerText = 'I';
  contentItemsTypes['i'].onmousedown = ($event: any) => $event.preventDefault();
  contentItemsTypes['i'].onmouseup = ($event: any) => $event.preventDefault();
  contentItemsTypes['i'].onclick = ($event: any) => ($event.preventDefault(), document.execCommand('italic'));
  contentItems.appendChild(contentItemsTypes['i']);

  // Define content items: u
  contentItemsTypes['u'] = document.createElement('div');
  contentItemsTypes['u'].className = 'item u';
  contentItemsTypes['u'].innerText = 'U';
  contentItemsTypes['u'].onmousedown = ($event: any) => $event.preventDefault();
  contentItemsTypes['u'].onmouseup = ($event: any) => $event.preventDefault();
  contentItemsTypes['u'].onclick = ($event: any) => ($event.preventDefault(), document.execCommand('underline'));
  contentItems.appendChild(contentItemsTypes['u']);

  // Define content items: s
  contentItemsTypes['s'] = document.createElement('div');
  contentItemsTypes['s'].className = 'item s';
  contentItemsTypes['s'].innerText = 'S';
  contentItemsTypes['s'].onmousedown = ($event: any) => $event.preventDefault();
  contentItemsTypes['s'].onmouseup = ($event: any) => $event.preventDefault();
  contentItemsTypes['s'].onclick = ($event: any) => ($event.preventDefault(), document.execCommand('strikethrough'));
  contentItems.appendChild(contentItemsTypes['s']);

  // Verify readonly
  if (item.readonly || item.type !== 'richtext') {
    for (const i in contentItemsTypes) {
      contentItemsTypes[i].style.display = 'none';
    }
  }

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Utils
 ********************************************************************************************************************/

function isIcon(image: string): boolean {
  return !!(image || 'default').match(/^[a-z-]+$/);
}

function setItemsToReadonly(items: any): any {
  for (const item of items) {
    item.readonly = true;
    if (item.items) {
      item.items = setItemsToReadonly(item.items);
    }
  }
  return items;
}
