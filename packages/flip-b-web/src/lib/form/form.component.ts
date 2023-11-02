import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {DataService} from '../core/data.service';

@Component({
  selector: 'flb-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  @Input() form: any;
  @Input() modal: any;

  constructor(
    public data: DataService,
    public _element: ElementRef
  ) {}

  async ngOnInit(): Promise<any> {
    if (typeof this.form === 'undefined') {
      const snap: any = this.data.getRouterSnap();
      this.form = {...snap.data};
      this.form.body = {...(this.form.body || {})};
      this.form.body.params = {...snap.params, ...snap.queryParams, ...history.state};
    }
    window.form = this.form = loadForm({form: this.form, self: this});
  }
}

/***********************************************************************************************************************
 *** Load Form
 **********************************************************************************************************************/

function loadForm({form, self}: any): any {
  const copy: any = self.data.getObjectCopy(form);

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
    if (e?.match(/^on[A-Z][A-Za-z]+/)) {
      if (typeof copy[e] === 'function') {
        form[e] = copy[e];
      } else if (typeof copy[e] === 'string') {
        form[e] = new Function('{form, item}', `return (${copy[e]});`);
      }
    }
  }

  // Define auth
  // @param {Function}
  Object.defineProperty(form, 'auth', {
    value: function (...args: any): any {
      return self.data.auth(...args);
    },
    enumerable: false
  });

  // Define goto
  // @param {Function}
  Object.defineProperty(form, 'goto', {
    value: function (...args: any): any {
      return self.data.goto(...args);
    },
    enumerable: false
  });

  // Define http
  // @param {Function}
  Object.defineProperty(form, 'http', {
    value: function (...args: any): any {
      return self.data.http(...args);
    },
    enumerable: false
  });

  // Define i18n
  // @param {Function}
  Object.defineProperty(form, 'i18n', {
    value: function (...args: any): any {
      return self.data.i18n(...args);
    },
    enumerable: false
  });

  // Define open
  // @param {Function}
  Object.defineProperty(form, 'open', {
    value: function (form: any): any {
      return self.data.showWindow({component: FormComponent, componentProps: {form}});
    },
    enumerable: false
  });

  // Define sendDownload
  // @param {Function}
  Object.defineProperty(form, 'sendDownload', {
    value: function (...args: any): any {
      return self.data.sendDownload(...args);
    },
    enumerable: false
  });

  // Define sendPrint
  // @param {Function}
  Object.defineProperty(form, 'sendPrint', {
    value: function (...args: any): any {
      return self.data.sendPrint(...args);
    },
    enumerable: false
  });

  // Define sendShare
  // @param {Function}
  Object.defineProperty(form, 'sendShare', {
    value: function (...args: any): any {
      return self.data.sendShare(...args);
    },
    enumerable: false
  });

  // Define showContextMenu
  // @param {Function}
  Object.defineProperty(form, 'showContextMenu', {
    value: function (...args: any): any {
      return self.data.showContextMenu(...args);
    },
    enumerable: false
  });

  // Define showLoading
  // @param {Function}
  Object.defineProperty(form, 'showLoading', {
    value: function (...args: any): any {
      return self.data.showLoading(...args);
    },
    enumerable: false
  });

  // Define showMessage
  // @param {Function}
  Object.defineProperty(form, 'showMessage', {
    value: function (...args: any): any {
      return self.data.showMessage(...args);
    },
    enumerable: false
  });

  // Define showSuccess
  // @param {Function}
  Object.defineProperty(form, 'showSuccess', {
    value: function (...args: any): any {
      return self.data.showSuccess(...args);
    },
    enumerable: false
  });

  // Define showWarning
  // @param {Function}
  Object.defineProperty(form, 'showWarning', {
    value: function (...args: any): any {
      return self.data.showWarning(...args);
    },
    enumerable: false
  });

  // Define showPrompt
  // @param {Function}
  Object.defineProperty(form, 'showPrompt', {
    value: function (...args: any): any {
      return self.data.showPrompt(...args);
    },
    enumerable: false
  });

  // Define showWindow
  // @param {Function}
  Object.defineProperty(form, 'showWindow', {
    value: function (...args: any): any {
      return self.data.showWindow(...args);
    },
    enumerable: false
  });

  // Define trigger
  // @param {Function}
  Object.defineProperty(form, 'trigger', {
    value: function (name: any, item: any, $event: any): any {
      return formEvent({form, item, name, $event});
    },
    enumerable: false
  });

  // Define onFinish
  // @param {Function}
  if (self.modal?.dismiss) {
    Object.defineProperty(form, 'onFinish', {
      value: function (data: any, role: any): any {
        return self.modal.dismiss(data, role);
      },
      enumerable: false
    });
  }

  // Define self
  // @param {Object}
  Object.defineProperty(form, 'self', {
    get: (): any => self
  });

  // Define user
  // @param {Object}
  Object.defineProperty(form, 'user', {
    get: (): any => self.data.user
  });

  const auth = form.user.access.auth || '';
  const uses = form.meta[auth]?.uses || [];

  if (form.meta[auth]?.hide?.length) {
    form.fields = form.fields.filter((i: any) => !form.meta[auth].hide.includes(i.name));
  }
  if (form.meta[auth]?.show?.length) {
    form.fields = form.fields.filter((i: any) => form.meta[auth].show.includes(i.name));
  }

  const slot: any = self.data.getObjectSlot([...(copy.fields || [])], form.name);

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

  // Define header
  if (!form.header.length) {
    form.header.push({name: 'header', type: 'header'});
    if (!form.self.modal) {
      form.header.push({name: 'toggle', type: 'circle', class: {'ion-hide-lg-up': true}});
    } else {
      form.header.push({name: 'cancel', type: 'circle'});
    }
  }

  // Define form type: search
  if (form.type === 'search') {
    form.navbar.push({name: 'search', type: 'search'});
  }
  if (form.type === 'search' && uses.includes('search') && form.filter.length) {
    form.navbar.push({name: 'filter', type: 'circle'});
  }
  if (form.type === 'search' && uses.includes('create')) {
    form.navbar.push({name: 'expand', type: 'expand'});
  }
  if (form.type === 'search' && uses.includes('create')) {
    form.navbar.push({name: 'create', type: 'circle'});
  }
  if (form.type === 'search' && uses.includes('search') && form.filter.length) {
    for (const item of form.filter) {
      item.onInput = () => form.trigger('start');
    }
  }

  // Define form type: update
  if (form.type === 'update' && uses.includes('shares')) {
    form.navbar.push({name: 'download', type: 'circle'});
  }
  if (form.type === 'update' && uses.includes('shares') && typeof navigator.share === 'undefined') {
    form.navbar.push({name: 'print', type: 'circle'});
  }
  if (form.type === 'update' && uses.includes('shares') && typeof navigator.share !== 'undefined') {
    form.navbar.push({name: 'share', type: 'circle'});
  }
  if (form.type === 'update' && uses.includes('shares')) {
    form.navbar.push({name: 'sendmail', type: 'circle'});
  }
  if (form.type === 'update' && uses.includes('delete')) {
    form.navbar.push({name: 'expand', type: 'expand'});
  }
  if (form.type === 'update' && uses.includes('delete')) {
    form.navbar.push({name: 'delete', type: 'circle'});
  }
  if (form.type === 'update' && uses.includes('select') && form.fields.length) {
    form.fields = setItemsToReadonly(form.fields);
  }
  if (form.type === 'update' && uses.includes('update') && form.fields.length) {
    form.footer = [];
    form.footer.push({name: 'cancel', type: 'button'});
    form.footer.push({name: 'submit', type: 'button'});
  }

  // Define form type: create
  if (form.type === 'create' && uses.includes('select') && form.fields.length) {
    form.fields = setItemsToReadonly(form.fields);
  }
  if (form.type === 'create' && uses.includes('create') && form.fields.length) {
    form.footer = [];
    form.footer.push({name: 'cancel', type: 'button'});
    form.footer.push({name: 'submit', type: 'button'});
  }

  // Define items
  for (const t of ['header', 'footer', 'navbar', 'filter', 'fields', 'values']) {
    form[t] = form[t].map((i: any) => loadItem({form, item: i}));
  }

  // Define $copy
  // @param {Object}
  Object.defineProperty(form, '$copy', {
    get: (): any => copy
  });

  // Define $init
  // @param {Object}
  Object.defineProperty(form, '$init', {
    get: (): any => true
  });

  // Define $slot
  // @param {Object}
  Object.defineProperty(form, '$slot', {
    get: (): any => slot
  });

  // Define $uses
  // @param {Object}
  Object.defineProperty(form, '$uses', {
    get: (): any => uses
  });

  // Update form
  Object.keys(form).forEach((k: any) => (typeof form[k] === 'undefined' ? delete form[k] : {}));

  // Start
  form.trigger('start');

  // Return form
  return form;
}

/***********************************************************************************************************************
 *** Load Item
 **********************************************************************************************************************/

function loadItem({form, item}: any): any {
  const copy: any = form.self.data.getObjectCopy(item);

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
  // @param {Number|String}
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
    if (e?.match(/^on[A-Z][A-Za-z]+/)) {
      if (typeof copy[e] === 'function') {
        item[e] = copy[e];
      } else if (typeof copy[e] === 'string') {
        item[e] = new Function('{form, item}', `return (${copy[e]});`);
      }
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
  if (item.type === 'id') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text'};
  } else if (item.type === 'text') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text'};
  } else if (item.type === 'textarea') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', control: 'textarea'};
  } else if (item.type === 'richtext') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', control: 'textarea'};
  } else if (item.type === 'decimal') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'decimal'};
  } else if (item.type === 'integer') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'numeric'};
  } else if (item.type === 'percent') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'decimal'};
  } else if (item.type === 'currency') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'decimal'};
  } else if (item.type === 'quantity') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'decimal'};
  } else if (item.type === 'date') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'datetime') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'time') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'year') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'year-month') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', popover: 'datetime'};
  } else if (item.type === 'search') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text'};
  } else if (item.type === 'select') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', popover: 'selector'};
  } else if (item.type === 'switch') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text'};
  } else if (item.type === 'toggle') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text'};
  } else if (item.type === 'attachment') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'document') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'image') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'audio') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'video') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'file') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'selfie') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'url', popover: 'document'};
  } else if (item.type === 'website') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'url'};
  } else if (item.type === 'address') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', popover: 'location'};
  } else if (item.type === 'phone') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'tel'};
  } else if (item.type === 'email') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'email'};
  } else if (item.type === 'color') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text', popover: 'colorize'};
  } else if (item.type === 'username') {
    item.$ctrl = {contentInput: 'text', currentInputMode: 'text'};
  } else if (item.type === 'password') {
    item.$ctrl = {contentInput: 'password', currentInputMode: 'text'};
  }

  // Define control content
  item.$ctrl.content = true;
  item.$ctrl.contentTitle = item.text?.title || form.i18n(`${item.path}.$title`) || '';
  item.$ctrl.contentLabel = item.text?.label || form.i18n(`${item.path}.$label`) || '';
  item.$ctrl.contentNotes = item.text?.notes || form.i18n(`${item.path}.$notes`) || '';
  item.$ctrl.contentPlace = item.text?.place || form.i18n(`${item.path}.$place`) || '';
  item.$ctrl.contentClass = item.text?.class || form.i18n(`${item.path}.$class`) || {};
  item.$ctrl.contentStyle = item.text?.style || form.i18n(`${item.path}.$style`) || {};
  item.$ctrl.contentColor = item.icon?.color || form.i18n(`${item.path}.$color`) || '';
  item.$ctrl.contentImage = item.icon?.image || form.i18n(`${item.path}.$image`) || '';
  item.$ctrl.contentImageIsIcon = () => isIcon(item.$ctrl.contentImage);

  item.$ctrl.currentEvent = {};
  item.$ctrl.currentInput = undefined;
  item.$ctrl.currentValue = undefined;
  item.$ctrl.currentValid = true;

  item.$ctrl.picture = false;
  item.$ctrl.trigger = false;

  // Define item classes
  item.class[`flb-item-type-${item.type}`] = true;
  item.class[`flb-item-name-${item.name}`] = true;

  if (item.size) {
    item.style['width'] = item.size;
  }

  if (item.$ctrl.contentInput && item.onClick) {
    item.class[`flb-item-type-button`] = true;
    item.class['button'] = true;
    item.$ctrl.picture = true;
  }
  if (['header'].includes(item.type)) {
    item.$ctrl.picture = true;
  }
  if (['button', 'circle', 'values'].includes(item.type)) {
    item.class['button'] = true;
    item.$ctrl.picture = true;
  }
  if (item.$ctrl.contentInput && !item.$ctrl.picture) {
    item.$ctrl.trigger = true;
  }

  // Define default events by type and name
  if (item.type === 'circle' && item.name === 'toggle') {
    item.onClick = item.onClick || (({form}: any) => form.showContextMenu(true));
  } else if (item.type === 'search' && item.name === 'search') {
    item.onInput = item.onInput || itemSearchActionInput;
  } else if (item.type === 'values' && item.name === 'select') {
    item.onClick = item.onClick || itemSelectValuesClick;
  } else if (item.type === 'button' && item.name === 'cancel') {
    item.onClick = item.onClick || itemCancelButtonClick;
  } else if (item.type === 'button' && item.name === 'submit') {
    item.onClick = item.onClick || itemSubmitButtonClick;
  } else if (item.type === 'circle' && item.name === 'filter') {
    item.onClick = item.onClick || itemFilterButtonClick;
  } else if (item.type === 'circle' && item.name === 'create') {
    item.onClick = item.onClick || itemCreateButtonClick;
  } else if (item.type === 'circle' && item.name === 'delete') {
    item.onClick = item.onClick || itemDeleteButtonClick;
  } else if (item.type === 'circle' && item.name === 'cancel') {
    item.onClick = item.onClick || itemCancelButtonClick;
  } else if (item.type === 'circle' && item.name === 'submit') {
    item.onClick = item.onClick || itemSubmitButtonClick;
  } else if (item.type === 'circle' && item.name === 'download') {
    item.onClick = item.onClick || itemDownloadButtonClick;
  } else if (item.type === 'circle' && item.name === 'print') {
    item.onClick = item.onClick || itemPrintButtonClick;
  } else if (item.type === 'circle' && item.name === 'share') {
    item.onClick = item.onClick || itemShareButtonClick;
  } else if (item.type === 'circle' && item.name === 'sendmail') {
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
    item.data = {...(item.data || {})};
    item.data.items = item.data.items || form.i18n(`${item.path}.$items`) || [];

    if (item.data.view) {
      const view: any = form.self.data.info.page.values.find((v: any) => v.name === item.data.view);
      if (view) {
        item.data.rest = view.rest;
        item.data.body = view.body || {filter: {limit: 10}};
        item.data.slot = form.self.data.getObjectSlot([...(view.fields || [])], view.name);
      }
    }
      console.log(item.name, item.data)

    // if (typeof item.data.readonly === 'undefined') {
    //   item.data.readonly = item.readonly || false;
    // }

    // if (typeof item.data.editable === 'undefined') {
    //   item.data.editable = false;
    // }

    // if (typeof item.data.populate === 'undefined' && !item.data.editable) {
    //   item.data.populate = false;
    // }

    // if (!item.data.items && item.data.populate) {
    //   item.data.items = item.data.items || [];
    //   //form.http({lookup: form.rest, data: {index: item.name}})
    //   //  .then((values: any) => {
    //   //    item.data.items = values;
    //   //  })
    //   //  .catch(console.warn);
    // }
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

  // Define notes
  // @param {Mixed}
  Object.defineProperty(item, 'notes', {
    get: (): any => item.$ctrl.contentNotes,
    set: (notes: any): any => (item.$ctrl.contentNotes = notes)
  });

  // Define place
  // @param {Mixed}
  Object.defineProperty(item, 'place', {
    get: (): any => item.$ctrl.contentPlace,
    set: (place: any): any => (item.$ctrl.contentPlace = place)
  });

  // Define image
  // @param {Mixed}
  Object.defineProperty(item, 'image', {
    get: (): any => item.$ctrl.contentImage,
    set: (image: any): any => (item.$ctrl.contentImage = image)
  });

  // Define input
  // @param {Mixed}
  Object.defineProperty(item, 'event', {
    get: (): any => item.$ctrl.currentEvent,
    set: (event: any): any => {
      item.$ctrl.currentEvent = event;
    }
  });

  // Define input
  // @param {Mixed}
  Object.defineProperty(item, 'input', {
    get: (): any => item.$ctrl.currentInput,
    set: (input: any): any => {
      item.$ctrl.currentInput = input;
      form.trigger('input', item);
    }
  });

  // Define value
  // @param {Mixed}
  Object.defineProperty(item, 'value', {
    get: (): any => item.$ctrl.currentValue,
    set: (value: any): any => {
      item.$ctrl.currentValue = value;
      form.trigger('setup', item);
    }
  });

  // Define value
  // @param {Mixed}
  Object.defineProperty(item, 'valid', {
    get: (): any => item.$ctrl.currentValid,
    set: (valid: any): any => {
      item.$ctrl.currentValid = valid;
    }
  });

  // Define $copy
  // @param {Object}
  Object.defineProperty(item, '$copy', {
    get: (): any => copy
  });

  // Define $init
  // @param {Object}
  Object.defineProperty(item, '$init', {
    get: (): any => true
  });

  // Update item
  Object.keys(item).forEach((k: any) => (typeof item[k] === 'undefined' ? delete item[k] : {}));

  // Return item
  return item;
}

/***********************************************************************************************************************
 *** Set Item Value
 **********************************************************************************************************************/

function setItemValue({form, item}: any): any {
  if (item.event.type === 'click' && (item.disabled || item.readonly)) {
    return false;
  }
  if (item.event.type === 'click') {
    item.disabled = true;
  }
  if (item.event.type === 'enter' && (item.disabled || item.readonly)) {
    return false;
  }
  if (item.event.type === 'leave' && (item.disabled || item.readonly)) {
    return false;
  }
  if (item.event.type === 'input' && (item.disabled || item.readonly)) {
    return false;
  }

  // Define value for field type
  if (item.event.type === 'setup' && ['header', 'footer', 'values', 'legend'].includes(item.type)) {
    item.$ctrl.currentValue = item.$ctrl.currentValue || {};
    item.$ctrl.contentTitle = item.$ctrl.currentValue?.title || item.$ctrl.contentTitle;
    item.$ctrl.contentLabel = item.$ctrl.currentValue?.label || item.$ctrl.contentLabel;
    item.$ctrl.contentNotes = item.$ctrl.currentValue?.notes || item.$ctrl.contentNotes;
    item.$ctrl.contentPlace = item.$ctrl.currentValue?.place || item.$ctrl.contentPlace;
    item.$ctrl.contentClass = item.$ctrl.currentValue?.class || item.$ctrl.contentClass;
    item.$ctrl.contentStyle = item.$ctrl.currentValue?.style || item.$ctrl.contentStyle;
    item.$ctrl.contentImage = item.$ctrl.currentValue?.image || item.$ctrl.contentImage;
    return;
  }

  // Define value for array type
  if (item.event.type === 'setup' && item.type === 'array') {
    item.$ctrl.currentValue = item.$ctrl.currentValue || [];
    const arrayItems: any = [];
    const arrayValue: any = [];
    const arrayTitle: any = [];
    for (const v in item.$ctrl.currentValue) {
      if (item.$ctrl.currentValue?.[v] && item.$ctrl.currentItems?.[v]) {
        arrayItems.push(item.$ctrl.currentItems[v]);
        arrayValue.push(item.$ctrl.currentValue[v]);
        continue;
      }
      const groupItems: any = item.items.map((i: any) => loadItem({form, item: {...i, path: item.path}}));
      arrayItems.push(groupItems);
      arrayValue.push(setBodyValue(form, groupItems, item.$ctrl.currentValue[v]));
    }
    if (arrayItems.length === arrayValue.length) {
      const groupItems: any = item.items.map((i: any) => loadItem({form, item: {...i, path: item.path}}));
      arrayTitle.push(groupItems);
    }
    item.$ctrl.currentItems = arrayItems;
    item.$ctrl.currentValue = arrayValue;
    item.$ctrl.currentTitle = arrayTitle;
  }

  // Define value for group type
  if (item.event.type === 'setup' && item.type === 'group') {
    item.$ctrl.currentValue = item.$ctrl.currentValue || {};
    if (!item.$ctrl.currentItems) {
      const groupItems: any = item.items.map((i: any) => loadItem({form, item: {...i, path: item.path}}));
      const groupValue: any = setBodyValue(form, groupItems, item.$ctrl.currentValue);
      item.$ctrl.currentItems = groupItems;
      item.$ctrl.currentValue = groupValue;
    }
  }

  // Define value for input type
  if (item.$ctrl.contentInput) {
    const i18n: any = form.i18n(item);
    item.$ctrl.currentInput = i18n.input;
    item.$ctrl.currentValue = i18n.value;
    item.$ctrl.currentValid = i18n.valid;

    if (['leave', 'input'].includes(i18n.event) && !i18n.valid) {
      item.$ctrl.contentNotes = item.$ctrl.currentValue ? form.i18n(`${item.path}.$error`) : form.i18n(`${item.path}.$alert`);
    } else {
      item.$ctrl.contentNotes = form.i18n(`${item.path}.$notes`);
    }
  }

  if (item.type === 'group' && item.readonly) {
    item.hide = Object.keys(item.$ctrl.currentValue).length ? false : true;
  }
  if (item.type === 'array' && item.readonly) {
    item.hide = item.$ctrl.currentValue.length ? false : true;
  }
  if (item.type === 'id') {
    item.hide = true;
  }

  // Define control
  if (item.$ctrl.control === 'textarea') {
    item.$ctrl.trigger = !item.readonly;
  }

  // Define popover
  if (item.$ctrl.popover === 'colorize') {
    item.$ctrl.contentColor = item.$ctrl.currentValue ? item.$ctrl.currentValue : undefined;
    item.$ctrl.trigger = !item.readonly || (item.$ctrl.currentValue && item.$ctrl.currentValid) ? true : false;
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

  // Define value for boolean input type
  if (['switch', 'toggle'].includes(item.type)) {
    const t = item.$ctrl.currentValue ? 'y' : 'n';
    item.$ctrl.currentInput = form.i18n(`${item.path}.$value-${t}`) || t;
    item.$ctrl.contentImage = form.i18n(`${item.path}.$image-${t}`) || item.$ctrl.contentImage || '';
    item.$ctrl.contentColor = form.i18n(`${item.path}.$color-${t}`) || item.$ctrl.contentColor || '';
  }

  // Verify event click
  if (item.event.type === 'click' && !item.class['button']) {
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
      item.$ctrl.contentImage = item.$ctrl.contentInput === 'text' ? 'eye' : 'person';
      item.$ctrl.contentInput = item.$ctrl.contentInput === 'text' ? 'password' : 'text';
    }
    if (item.type === 'password') {
      item.$ctrl.contentImage = item.$ctrl.contentInput === 'text' ? 'eye' : 'eye-off';
      item.$ctrl.contentInput = item.$ctrl.contentInput === 'text' ? 'password' : 'text';
    }
  }
}

/***********************************************************************************************************************
 *** Set Body Value
 **********************************************************************************************************************/

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
 *** Get Colorize Popover
 **********************************************************************************************************************/

function getColorizePopover({form, item, $el}: any): any {
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
  item.$ctrl.popoverNull = undefined;
  item.$ctrl.popoverData = item.$ctrl.currentValue;
  item.$ctrl.options = item.$ctrl.options || {...options};

  // Define content
  const $rs: any = {};
  $rs.content = document.createElement('div');
  $rs.content.className = 'flb-item-popover-colorize';
  $el.appendChild($rs.content);

  $rs.input = document.createElement('input');
  $rs.input.className = 'input';
  $rs.input.tabIndex = 1;
  $rs.input.type = 'color';
  $rs.input.value = item.$ctrl.popoverData;
  $rs.input.placeholder = form.i18n(`${form.name}.${item.name}.$popover.$colorize-input`);
  $rs.input.onchange = () => (item.$ctrl.popoverData = $rs.input.value);
  $rs.content.appendChild($rs.input);

  for (const color of options.colors) {
    if ($rs[color]) {
      continue;
    }
    $rs[color] = document.createElement('div');
    $rs[color].className = 'color';
    $rs[color].tabIndex = 1;
    $rs[color].style.backgroundColor = color;
    $rs[color].onclick = () => {
      $rs.input.value = color;
      item.$ctrl.popoverData = $rs.input.value;
    };
    $rs.content.appendChild($rs[color]);
  }

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Datetime Popover
 **********************************************************************************************************************/

function getDatetimePopover({form, item, $el}: any): any {
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
  item.$ctrl.popoverNull = undefined;
  item.$ctrl.popoverData = form.i18n({value: item.$ctrl.currentValue || new Date(), type: item.type, event: item.event}).value;
  item.$ctrl.options = item.$ctrl.options || {...(options[item.type] || {})};

  // Define content
  const $rs: any = {};
  $rs.content = document.createElement('div');
  $rs.content.className = 'flb-item-popover-datetime';
  $el.appendChild($rs.content);

  $rs.input = document.createElement('ion-datetime');
  $rs.input.className = 'input';
  $rs.input.size = 'cover';
  $rs.input.showDefaultTimeLabel = false;
  $rs.input.value = item.$ctrl.popoverData;
  $rs.input.locale = form.self.data.info.i18n.config.locale;
  $rs.input.presentation = item.$ctrl.options.presentation || 'date';
  $rs.input.addEventListener('ionChange', () => (item.$ctrl.popoverData = $rs.input.value));
  $rs.content.appendChild($rs.input);

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Document Popover
 **********************************************************************************************************************/

function getDocumentPopover({form, item, $el}: any): any {
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
  item.$ctrl.popoverNull = undefined;
  item.$ctrl.popoverData = item.$ctrl.currentValue || '';
  item.$ctrl.options = item.$ctrl.options || {...(options[item.type] || {})};

  // Define content
  const $rs: any = {};
  $rs.content = document.createElement('div');
  $rs.content.className = 'flb-item-popover-document';
  $el.appendChild($rs.content);

  $rs.frame = document.createElement('div');
  $rs.frame.className = 'frame';
  $rs.frame.style.display = 'none';
  $rs.frame.onclick = () => {
    const element: any = document.createElement('input');
    element.style.display = 'none';
    element.type = 'file';
    element.accept = item.$ctrl.options.accept || '*/*';
    element.capture = item.$ctrl.options.capture || 'environment';
    element.onchange = contentFetch;
    element.click();
  };
  $rs.content.appendChild($rs.frame);

  $rs.click = document.createElement('div');
  $rs.click.className = 'click';
  $rs.click.style.display = 'none';
  $rs.click.onclick = () => {
    const element: any = document.createElement('a');
    element.style.display = 'none';
    element.href = item.$ctrl.popoverData;
    element.target = '_system';
    element.click();
  };
  $rs.content.appendChild($rs.click);

  // Define content fetch
  const contentFetch: any = async ($event: any) => {
    try {
      const file: any = $event.target.files[0];
      await form.showLoading({message: item.path});
      const result: any = await form.http({upload: form.rest, data: {index: item.name}, form: {file}});
      contentParse(result?.url);
      await form.showSuccess({message: item.path});
    } catch (error: any) {
      await form.showWarning({message: item.path, error});
    }
  };

  // Define content parse
  const contentParse: any = (value: any = undefined) => {
    if (value) {
      item.$ctrl.popoverData = value;
    }
    const failimg: any = `https://fakeimg.pl/300x300/ffffff/?text=${item.$ctrl.contentPlace}&font_size=18`;
    $rs.frame.innerHTML = `<img src="${item.$ctrl.popoverData || failimg}" onerror="this.onerror=null;this.src='${failimg}';" />`;
    $rs.frame.style.display = 'block';
    $rs.click.innerHTML = `<img src="https://fakeimg.pl/300x30/ffffff/?text=Descargar&font_size=18" />`;
    $rs.click.style.display = item.$ctrl.popoverData ? 'block' : 'none';
  };

  // Verify current value
  if (!item.readonly && !item.$ctrl.popoverData) {
    $rs.frame.click();
  }
  contentParse();

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Location Popover
 **********************************************************************************************************************/

function getLocationPopover({form, item, $el}: any): any {
  if ($el.loaded) {
    return $el.loaded;
  }
  $el.loaded = true;

  // Define popover
  item.$ctrl.popoverNull = undefined;
  item.$ctrl.popoverData = {...(item.$ctrl.currentValue || {})};

  // Define content
  const $rs: any = {};
  $rs.content = document.createElement('div');
  $rs.content.className = 'flb-item-popover-location';
  $el.appendChild($rs.content);

  $rs.street = document.createElement('input');
  $rs.street.className = 'input input-street';
  $rs.street.tabIndex = 1;
  $rs.street.type = 'text';
  $rs.street.value = item.$ctrl.popoverData?.street || '';
  $rs.street.placeholder = form.i18n(`${form.name}.${item.name}.$popover.$location-input-street`);
  $rs.street.onkeyup = () => setAddressFromGoogleGeocoder();
  $rs.content.appendChild($rs.street);

  $rs.portal = document.createElement('input');
  $rs.portal.className = 'input input-portal';
  $rs.portal.tabIndex = 1;
  $rs.portal.type = 'text';
  $rs.portal.value = item.$ctrl.popoverData?.portal || '';
  $rs.portal.placeholder = form.i18n(`${form.name}.${item.name}.$popover.$location-input-portal`);
  $rs.portal.onkeyup = () => setAddressFromGoogleGeocoder();
  $rs.content.appendChild($rs.portal);

  $rs.city = document.createElement('input');
  $rs.city.className = 'input input-city';
  $rs.city.tabIndex = 1;
  $rs.city.type = 'text';
  $rs.city.value = item.$ctrl.popoverData?.city || '';
  $rs.city.style.display = 'inline-block';
  $rs.city.style.width = '50%';
  $rs.city.placeholder = form.i18n(`${form.name}.${item.name}.$popover.$location-input-city`);
  $rs.city.onkeyup = () => setAddressFromGoogleGeocoder();
  $rs.content.appendChild($rs.city);

  $rs.state = document.createElement('input');
  $rs.state.className = 'input input-state';
  $rs.state.tabIndex = 1;
  $rs.state.type = 'text';
  $rs.state.value = item.$ctrl.popoverData?.state || '';
  $rs.state.style.display = 'inline-block';
  $rs.state.style.width = '50%';
  $rs.state.placeholder = form.i18n(`${form.name}.${item.name}.$popover.$location-input-state`);
  $rs.state.onkeyup = () => setAddressFromGoogleGeocoder();
  $rs.content.appendChild($rs.state);

  $rs.country = document.createElement('input');
  $rs.country.className = 'input input-country';
  $rs.country.tabIndex = 1;
  $rs.country.type = 'text';
  $rs.country.value = item.$ctrl.popoverData?.country || '';
  $rs.country.style.display = 'inline-block';
  $rs.country.style.width = '50%';
  $rs.country.placeholder = form.i18n(`${form.name}.${item.name}.$popover.$location-input-country`);
  $rs.country.onkeyup = () => setAddressFromGoogleGeocoder();
  $rs.content.appendChild($rs.country);

  $rs.zipcode = document.createElement('input');
  $rs.zipcode.className = 'input input-zipcode';
  $rs.zipcode.tabIndex = 1;
  $rs.zipcode.type = 'text';
  $rs.zipcode.value = item.$ctrl.popoverData?.zipcode || '';
  $rs.zipcode.style.display = 'inline-block';
  $rs.zipcode.style.width = '50%';
  $rs.zipcode.placeholder = form.i18n(`${form.name}.${item.name}.$popover.$location-input-zipcode`);
  $rs.zipcode.onkeyup = () => setAddressFromGoogleGeocoder();
  $rs.content.appendChild($rs.zipcode);

  if (window.libs.google?.maps) {
    $rs.frame = document.createElement('div');
    $rs.frame.className = 'frame';
    $rs.content.appendChild($rs.frame);

    $rs.map = new window.libs.google.maps.Map($rs.frame, {zoom: 14});
    $rs.pos = new window.libs.google.maps.Marker({map: $rs.map, draggable: !item.readonly});

    window.libs.google.maps.event.addListener($rs.pos, 'dragend', async () => {
      await setAddress(
        await getAddressFromGoogleGeocoder({
          location: {
            lat: $rs.pos.getPosition().lat(),
            lng: $rs.pos.getPosition().lng()
          }
        })
      );
    });
  }

  // Set address
  const setAddress: any = async (address: any) => {
    $rs.street.value = address.street || '';
    $rs.portal.value = address.portal || $rs.portal.value || '';
    $rs.city.value = address.city || '';
    $rs.state.value = address.state || '';
    $rs.country.value = address.country || '';
    $rs.zipcode.value = address.zipcode || $rs.zipcode.value || '';

    if ($rs.map && $rs.pos) {
      $rs.pos.setPosition({lat: address.position.lat, lng: address.position.lng});
      $rs.map.panTo($rs.pos.getPosition());
    }

    item.$ctrl.popoverData = item.$ctrl.popoverData || {};
    item.$ctrl.popoverData.street = $rs.street.value || '';
    item.$ctrl.popoverData.portal = $rs.portal.value || '';
    item.$ctrl.popoverData.city = $rs.city.value || '';
    item.$ctrl.popoverData.state = $rs.state.value || '';
    item.$ctrl.popoverData.country = $rs.country.value || '';
    item.$ctrl.popoverData.zipcode = $rs.zipcode.value || '';
    item.$ctrl.popoverData.position = [address.position.lat, address.position.lng];
  };

  // Set address from google geocoder
  const setAddressFromGoogleGeocoder: any = async () => {
    await setAddress(
      await getAddressFromGoogleGeocoder({
        address: [$rs.street.value, $rs.city.value, $rs.state.value, $rs.country.value]
          .filter((v) => !!v)
          .join(', ')
          .trim()
      })
    );
  };

  // Set address from device position
  const setAddressFromDevicePosition: any = async () => {
    await setAddress(await getAddressFromDevicePosition());
  };

  // Get address from google geocoder
  const getAddressFromGoogleGeocoder: any = (params: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const geocoder: any = new window.libs.google.maps.Geocoder();
      geocoder.geocode(params, (values: any, status: any) => {
        if (status !== 'OK' || !values?.length) {
          return reject();
        }
        const result: any = {};
        values[0].address_components.forEach((r: any) => {
          if (r.types.includes('route')) {
            result.street = formatAddressText(r.short_name);
          }
        });
        values[0].address_components.forEach((r: any) => {
          if (r.types.includes('street_number') && result.street) {
            result.street = result.street + ' ' + formatAddressText(r.long_name);
          }
        });
        values[0].address_components.forEach((r: any) => {
          if (r.types.includes('administrative_area_level_2')) {
            result.city = formatAddressText(r.long_name);
          }
        });
        values[0].address_components.forEach((r: any) => {
          if (r.types.includes('locality')) {
            result.city = formatAddressText(r.long_name);
          }
        });
        values[0].address_components.forEach((r: any) => {
          if (r.types.includes('administrative_area_level_1')) {
            result.state = formatAddressText(r.long_name);
          }
        });
        values[0].address_components.forEach((r: any) => {
          if (r.types.includes('country')) {
            result.country = formatAddressText(r.long_name);
          }
        });
        values[0].address_components.forEach((r: any) => {
          if (r.types.includes('postal_code')) {
            result.zipcode = formatAddressText(r.long_name);
          }
        });
        if (!result.street && values[0].formatted_address) {
          result.street = values[0].formatted_address.split(',')[0].trim();
        }
        if (!result.city || result.city.match(/^capital/i)) {
          result.city = result.state;
        }
        result.position = {
          lat: values[0].geometry.location.lat(),
          lng: values[0].geometry.location.lng()
        };
        resolve(result);
      });
    });
  };

  // Get address from device position
  const getAddressFromDevicePosition: any = (): Promise<any> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(async (value: any) => {
        if (value && value.coords) {
          const result: any = await getAddressFromGoogleGeocoder({location: {lat: value.coords.latitude, lng: value.coords.longitude}});
          resolve(result);
        } else {
          const result: any = await getAddressFromGoogleGeocoder({location: {lat: -31.4007206, lng: -64.180734}});
          resolve(result);
        }
      });
    });
  };

  // Format address text
  const formatAddressText: any = (value: any): any => {
    let result = value || '';
    result = result.toString();
    result = result.replace(/\s\s+/, ' ').trim();
    result = result
      .split(' ')
      .map((word: string) => {
        if (word.match(/[0-9]+/)) {
          return word.toUpperCase();
        }
        if (word.match(/[^a-záéíóúñ]/)) {
          return word;
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join(' ');
    result = ` ${result} `.replace(/ Y /gi, ' y ').trim();
    result = ` ${result} `.replace(/ O /gi, ' o ').trim();
    result = ` ${result} `.replace(/ X /gi, ' x ').trim();
    result = ` ${result} `.replace(/ De /gi, ' de ').trim();
    result = ` ${result} `.replace(/ En /gi, ' en ').trim();
    result = ` ${result} `.replace(/ Con /gi, ' con ').trim();
    result = ` ${result} `.replace(/ Sin /gi, ' sin ').trim();
    result = ` ${result} `.replace(/ Para /gi, ' para ').trim();
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  };

  if ($rs.map && $rs.pos) {
    if (item.$ctrl.popoverData?.position) {
      $rs.pos.setPosition({lat: item.$ctrl.popoverData.position[0], lng: item.$ctrl.popoverData.position[1]});
      $rs.map.panTo($rs.pos.getPosition());
    } else if (item.$ctrl.popoverData?.street) {
      setAddressFromGoogleGeocoder();
    } else {
      setAddressFromDevicePosition();
    }
  }

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Selector Popover
 **********************************************************************************************************************/

function getSelectorPopover({form, item, $el}: any): any {
  if ($el.loaded) {
    return $el.loaded;
  }
  $el.loaded = true;

  // Define popover
  item.$ctrl.popoverNull = undefined;
  item.$ctrl.popoverData = item.$ctrl.currentValue || undefined;

  // Define content
  const $rs: any = {};
  $rs.content = document.createElement('div');
  $rs.content.className = 'flb-item-popover-selector';
  $el.appendChild($rs.content);

  $rs.input = document.createElement('input');
  $rs.input.className = 'input';
  $rs.input.tabIndex = 1;
  $rs.input.type = 'text';
  $rs.input.value = '';
  $rs.input.placeholder = form.i18n(`${form.name}.${item.name}.$popover.$selector-input`);
  $rs.input.onkeyup = () => contentFetch();
  $rs.content.appendChild($rs.input);

  $rs.items = document.createElement('div');
  $rs.items.className = 'items';
  $rs.content.appendChild($rs.items);

  // Define content fetch
  const contentFetch: any = async () => {

    if (item.data.rest) {
      item.data.items = await form.http({search: item.data.rest, qs: item.data.body?.filter});
      item.data.items = [...(item.data.items || [])];
      item.data.items = item.data.items.map((i: any) => form.self.data.setObjectSlot(item.data.slot || {}, i));
    }

    let items: any = [...(item.data.items || [])];
    if ($rs.input.value) {
      items = items.filter((v: any) => `${v.title || ''} ${v.label || ''}`.match(new RegExp(`${$rs.input.value}`, 'i')));
    }

    $rs.items.innerHTML = '';
    for (const i of items) {

      let isActive: any = false;

      //if (i.index && i.index === item.$ctrl.popoverData) {
      //  isActive = true;
      //}
      //if (!i.index && JSON.stringify({['_']: i.value}) === JSON.stringify({['_']: item.$ctrl.popoverData})) {
      //  isActive = true;
      //}

      if (JSON.stringify({['_']: i.index || i.value}) === JSON.stringify({['_']: item.$ctrl.popoverData})) {
        isActive = true;
      }


      let html: any = ``;
      html += `<div class="flb-item-picture">`;
      html += i.image && isIcon(i.image) ? `<ion-icon class="flb-item-picture-image" name="${i.image}" />` : '';
      html += i.image && !isIcon(i.image) ? `<ion-img class="flb-item-picture-image" src="${i.image}" alt="${i.title || ''}" />` : '';
      html += i.color && !i.image ? `<div class="flb-item-picture-image" style="background-color: ${i.color};"></div>` : '';
      html += `</div>`;
      html += `<div class="flb-item-content">`;
      html += i.title ? `<div class="flb-item-content-title">${i.title}</div>` : '';
      html += i.label ? `<div class="flb-item-content-label">${i.label}</div>` : '';
      html += `</div>`;

      const contentClick: any = document.createElement('div');
      contentClick.className = `flb-item flb-item-type-button button${isActive ? ' active' : ''}`;
      contentClick.tabIndex = 1;
      contentClick.innerHTML = html;
      contentClick.onkeyup = (e: any) => (e.keyCode === 13 ? contentClick.click() : contentClick.focus());
      contentClick.onclick = () => (item.$ctrl.popoverData = i.value);
      $rs.items.appendChild(contentClick);
    }
  };
  contentFetch();

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Get Textarea Control
 **********************************************************************************************************************/

function getTextareaControl({form, item, $el}: any): any {
  if ($el.loaded) {
    return $el.loaded;
  }
  $el.loaded = true;

  // Define content
  const $rs: any = {};
  $rs.content = document.createElement('div');
  $rs.content.className = 'flb-item-control-textarea';
  $el.appendChild($rs.content);

  $rs.input = document.createElement('div');
  $rs.input.className = 'input';
  $rs.input.tabIndex = 1;
  $rs.input.innerHTML = item.$ctrl.currentValue || '';
  $rs.input.dataset.title = item.$ctrl.contentTitle || '';
  $rs.input.dataset.label = item.$ctrl.contentLabel || '';
  $rs.input.dataset.place = item.$ctrl.contentPlace || form.i18n(`${form.name}.${item.name}.$popover.$selector-input`);
  $rs.input.contentEditable = !item.readonly;
  $rs.input.onkeyup = ($event: any) => {
    for (const i in $it) {
      $it[i].classList.remove('active');
    }
    const ws: any = window.getSelection();
    for (let i = 0; i < ws.rangeCount; i++) {
      let $s: any = ws.getRangeAt(i).startContainer;
      let $c = 0;
      while ($s?.parentNode && !$event.currentTarget.isEqualNode($s.parentNode) && $c < 100) {
        if (['B', 'I', 'U', 'STRIKE'].includes($s.parentNode.nodeName)) {
          const l = $s.parentNode.nodeName.substring(0, 1).toLowerCase();
          if ($it[l]) {
            $it[l].classList.toggle('active', true);
          }
        }
        $s = $s.parentNode;
        $c++;
      }
    }
  };
  $rs.content.appendChild($rs.input);

  $rs.items = document.createElement('div');
  $rs.items.className = 'items';
  $rs.content.appendChild($rs.items);

  const $it: any = {};

  $it.b = document.createElement('div');
  $it.b.className = 'item b';
  $it.b.innerText = 'B';
  $it.b.onmousedown = ($event: any) => $event.preventDefault();
  $it.b.onmouseup = ($event: any) => $event.preventDefault();
  $it.b.onclick = ($event: any) => ($event.preventDefault(), document.execCommand('bold'));
  $rs.items.appendChild($it.b);

  $it.i = document.createElement('div');
  $it.i.className = 'item i';
  $it.i.innerText = 'I';
  $it.i.onmousedown = ($event: any) => $event.preventDefault();
  $it.i.onmouseup = ($event: any) => $event.preventDefault();
  $it.i.onclick = ($event: any) => ($event.preventDefault(), document.execCommand('italic'));
  $rs.items.appendChild($it.i);

  $it.u = document.createElement('div');
  $it.u.className = 'item u';
  $it.u.innerText = 'U';
  $it.u.onmousedown = ($event: any) => $event.preventDefault();
  $it.u.onmouseup = ($event: any) => $event.preventDefault();
  $it.u.onclick = ($event: any) => ($event.preventDefault(), document.execCommand('underline'));
  $rs.items.appendChild($it.u);

  $it.s = document.createElement('div');
  $it.s.className = 'item s';
  $it.s.innerText = 'S';
  $it.s.onmousedown = ($event: any) => $event.preventDefault();
  $it.s.onmouseup = ($event: any) => $event.preventDefault();
  $it.s.onclick = ($event: any) => ($event.preventDefault(), document.execCommand('strikethrough'));
  $rs.items.appendChild($it.s);

  // Verify readonly
  if (item.readonly || item.type !== 'richtext') {
    for (const i in $it) {
      $it[i].style.display = 'none';
    }
  }

  // Return result
  return $el.loaded;
}

/***********************************************************************************************************************
 *** Utils
 **********************************************************************************************************************/

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

/***********************************************************************************************************************
 *** Form Event
 **********************************************************************************************************************/

async function formEvent({form, item, name, $event}: any): Promise<any> {
  try {
    const event: any = new CustomEvent(name, {detail: {form, item}});

    Object.defineProperty(event, 'target', {
      get: (): any => $event?.target
    });

    delete form.body.event;

    if ($event?.type === 'ionInfinite') {
      form.body.event = 'infinite';
    }
    if ($event?.type === 'ionRefresh') {
      form.body.event = 'refresh';
    }

    // if (item.event.type === 'input' && item.$ctrl.currentEvent?.target) {
    //   item.$ctrl.currentEvent.target.value = item.$ctrl.currentInput;
    // }

    if (item) {
      if (name === 'input' && $event?.keyCode === 13) {
        const submit = form.footer.find((i: any) => i.name === 'submit' && i.type === 'button');
        if (submit) {
          return form.trigger('click', submit, $event);
        }
      }
      if (name === 'input') {
        item.$ctrl.currentInput = event.target.value;
      }
      item.event = event;
    }

    const events: any = {};
    events['start'] = formStart;
    events['setup'] = itemSetup;
    events['click'] = itemClick;
    events['enter'] = itemEnter;
    events['leave'] = itemLeave;
    events['input'] = itemInput;
    await events[name]({form, item});

    if (typeof event.target?.complete === 'function') {
      event.target.complete();
    }

    //form.self._element.nativeElement.dispatchEvent(event);
  } catch (error: any) {
    await form.showWarning({message: `${form.name}.$${form.type}`, error});
  }
}

/***********************************************************************************************************************
 *** Form Start
 **********************************************************************************************************************/

async function formStart({form}: any): Promise<any> {
  try {
    await form.showLoading({message: `${form.name}.$${form.type}`});
    if (form.type === 'search') {
      if (form.body.event === 'infinite') {
        form.values = form.values || [];
      } else {
        form.values = [];
      }
      form.body.action = form.body.action || 'select';
      form.body.filter = form.body.filter || setBodyValue(form, form.filter, {}) || {};
      form.body.filter.skip = form.values.length;
      form.body.filter.limit = form.body.filter.limit || 20;

      let result: any = [];

      if (form.body.search) {
        result = [...form.body.search];
      } else if (form.rest) {
        result = await form.http({search: form.rest, qs: form.body.filter});
      }

      if (form.onSearch) {
        result = await form.onSearch({form, result});
      }

      for (const v of result) {
        const item: any = loadItem({form, item: {name: 'select', type: 'values'}});
        item.value = form.self.data.setObjectSlot(form.$slot, v);
        form.values.push(item);
      }
      if (form.body.filter.skip === 0 && !form.values.length && form.$uses.includes('create')) {
        const item: any = loadItem({form, item: {name: 'create', type: 'values', onClick: itemCreateButtonClick}});
        form.values.push(item);
      }
      if (form.body.filter.skip === 0 && !form.values.length && form.$uses.includes('create') === false) {
        const item: any = loadItem({form, item: {name: 'asless', type: 'values'}});
        form.values.push(item);
      }
    } else {
      let result: any = {};

      if (form.body.select) {
        result = {...form.body.select};
      } else if (form.rest && form.body.params.index) {
        result = await form.http({select: form.rest, data: {index: form.body.params.index}});
      }

      if (form.onSelect) {
        result = await form.onSelect({form, result});
      }

      form.body.values = setBodyValue(form, form.fields, result);
      form.body.result = {};

      if (form.header[0]?.type === 'header') {
        form.header[0].value = form.self.data.setObjectSlot(form.$slot, form.body.values);
      }
    }
    await form.showSuccess({message: `${form.name}.$${form.type}`});
  } catch (error: any) {
    await form.showWarning({message: `${form.name}.$${form.type}`, error});
  }
}

/***********************************************************************************************************************
 *** Item Setup
 **********************************************************************************************************************/

async function itemSetup({form, item}: any): Promise<any> {
  try {
    let show: any = true;
    if (setItemValue({form, item}) === false) {
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
    await form.showWarning({message: item.path, value: form.body, error});
    console.error('itemSetup', item, error);
  }
}

/***********************************************************************************************************************
 *** Item Click
 **********************************************************************************************************************/

async function itemClick({form, item}: any): Promise<any> {
  try {
    if (setItemValue({form, item}) === false) {
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
    await form.showWarning({message: item.path, value: form.body, error});
    console.error('itemClick', item, error);
  }
}

/***********************************************************************************************************************
 *** Item Enter
 **********************************************************************************************************************/

async function itemEnter({form, item}: any): Promise<any> {
  try {
    if (setItemValue({form, item}) === false) {
      return;
    } else if (item.onEnter) {
      await item.onEnter({form, item});
    } else if (form.onEnter) {
      await form.onEnter({form, item});
    }
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
    console.error('itemEnter', item, error);
  }
}

/***********************************************************************************************************************
 *** Item Leave
 **********************************************************************************************************************/

async function itemLeave({form, item}: any): Promise<any> {
  try {
    if (setItemValue({form, item}) === false) {
      return;
    } else if (item.onLeave) {
      await item.onLeave({form, item});
    } else if (form.onLeave) {
      await form.onLeave({form, item});
    }
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
    console.error('itemLeave', item, error);
  }
}

/***********************************************************************************************************************
 *** Item Input
 **********************************************************************************************************************/

async function itemInput({form, item}: any): Promise<any> {
  try {
    if (setItemValue({form, item}) === false) {
      return;
    } else if (item.onInput) {
      await item.onInput({form, item});
    } else if (form.onInput) {
      await form.onInput({form, item});
    }
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
    console.error('itemInput', item, error);
  }
}

/***********************************************************************************************************************
 *** Item Search Action
 **********************************************************************************************************************/

async function itemSearchActionInput({form, item}: any): Promise<any> {
  try {
    if (form.onSearchValues) {
      return await form.onSearchValues({form, item});
    }
    form.body.filter.query = item.$ctrl.currentValue;
    await form.trigger('start');
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Filter Button
 **********************************************************************************************************************/

async function itemFilterButtonClick({form, item}: any): Promise<any> {
  try {
    item.class['active'] = !item.class['active'];
    form.filterClass['hide'] = item.class['active'] ? false : true;
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Select Values
 **********************************************************************************************************************/

async function itemSelectValuesClick({form, item}: any): Promise<any> {
  try {
    if (form.onSelectValues) {
      return await form.onSelectValues({form, item, data: item.$ctrl.currentValue.value});
    }

    if (form.onFinish && form.body.action) {
      form.self.form = {...form.$copy, type: form.body.action, body: {select: item.value.value}};
      form.self.ngOnInit();
      return;
    }

    //if (form.body.action === 'submit') {
    //  form.self.form = {...form.$copy, type: 'submit', body: {select: item.value.value}};
    //  form.self.ngOnInit();
    //  return;
    //}
    //
    //if (form.body.action !== 'select') {
    //  return;
    //}

    const result: any = await form.open({...form.$copy, type: 'update', body: {params: item.$ctrl.currentValue}});
    if (result.role === 'submit') {
      item.value = form.self.data.setObjectSlot(form.$slot, {...result.data.form.body.values, ...result.data.form.body.result});
      setTimeout(() => (item.class['submit'] = true), 100);
      setTimeout(() => (item.class['submit'] = false), 500);
    } else if (result.role === 'cancel') {
      setTimeout(() => (item.class['cancel'] = true), 100);
      setTimeout(() => (item.class['cancel'] = false), 500);
    } else if (result.role === 'delete') {
      setTimeout(() => (item.class['delete'] = true), 100);
      setTimeout(() => (item.class['delete'] = false), 500);
      setTimeout(() => (item.hide = true), 500);
    }
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Create Button
 **********************************************************************************************************************/

async function itemCreateButtonClick({form, item}: any): Promise<any> {
  try {
    const result: any = await form.open({...form.$copy, type: 'create', meta: form.meta});
    if (result.role === 'submit') {
      const push: any = loadItem({form, item: {name: 'select', type: 'values'}});
      push.value = form.self.data.setObjectSlot(form.$slot, {...result.data.form.body.values, ...result.data.form.body.result});
      form.values.push(push);
      setTimeout(() => (push.class['submit'] = true), 100);
      setTimeout(() => (push.class['submit'] = false), 500);
    }
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Delete Button
 **********************************************************************************************************************/

async function itemDeleteButtonClick({form, item}: any): Promise<any> {
  try {
    const params: any = await form.showPrompt({path: `${form.name}.$delete`, data: form.body, type: 'danger'});
    if (params?.role !== 'submit') {
      return;
    }
    await form.showLoading({message: item.path});
    if (form.rest) {
      await form.http({delete: form.rest, data: form.body.params});
    }
    if (form.onDelete) {
      await form.onDelete({form, item});
    }
    if (form.onFinish) {
      await form.onFinish({form, item}, 'delete');
    }
    await form.showSuccess({message: item.path, value: form.body});
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Cancel Button
 **********************************************************************************************************************/

async function itemCancelButtonClick({form, item}: any): Promise<any> {
  try {
    await form.showLoading({message: item.path});
    if (form.onCancel) {
      await form.onCancel({form, item});
    }
    if (form.onFinish) {
      await form.onFinish({form, item}, 'cancel');
    }
    await form.showSuccess({message: item.path, value: form.body});
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Submit Button
 **********************************************************************************************************************/

async function itemSubmitButtonClick({form, item}: any): Promise<any> {
  try {
    await form.showLoading({message: item.path});
    if (!form.rest) {
      form.body.result = {};
    } else if (form.type === 'create') {
      form.body.result = await form.http({create: form.rest, data: form.body.params, body: form.body.values});
    } else if (form.type === 'update') {
      form.body.result = await form.http({update: form.rest, data: form.body.params, body: form.body.values});
    } else {
      form.body.result = await form.http({submit: form.rest, data: form.body.params, body: form.body.values});
    }
    if (form.body.result?.status === 200 && form.body.result?.headers) {
      await form.sendDownload(form.body.result);
    }
    if (form.onSubmit) {
      await form.onSubmit({form, item});
    }
    if (form.onFinish) {
      await form.onFinish({form, item}, 'submit');
    }
    await form.showSuccess({message: item.path, value: form.body});
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Download Button
 **********************************************************************************************************************/

async function itemDownloadButtonClick({form, item}: any): Promise<any> {
  try {
    await form.showLoading({message: item.path});
    const result: any = await form.http({select: form.rest, data: {index: form.body.params.index}, qs: {action: 'download'}, type: 'blob'});
    await form.sendDownload(result);
    await form.showSuccess({message: item.path, value: form.body});
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Print Button
 **********************************************************************************************************************/

async function itemPrintButtonClick({form, item}: any): Promise<any> {
  try {
    await form.showLoading({message: item.path});
    const result: any = await form.http({select: form.rest, data: {index: form.body.params.index}, qs: {action: 'print'}, type: 'blob'});
    await form.sendPrint(result);
    await form.showSuccess({message: item.path, value: form.body});
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Share Button
 **********************************************************************************************************************/

async function itemShareButtonClick({form, item}: any): Promise<any> {
  try {
    await form.showLoading({message: item.path});
    const result: any = await form.http({select: form.rest, data: {index: form.body.params.index}, qs: {action: 'share'}, type: 'blob'});
    await form.sendShare(result);
    await form.showSuccess({message: item.path, value: form.body});
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}

/***********************************************************************************************************************
 *** Item Sendmail Button
 **********************************************************************************************************************/

async function itemSendmailButtonClick({form, item}: any): Promise<any> {
  try {
    const params: any = await form.showPrompt({path: `${form.name}.$sendmail`, data: form.body, form: [{name: 'email', type: 'email', value: form.user.values.email}]});
    if (params?.role !== 'submit' || !params?.data?.values?.email) {
      return;
    }
    await form.showLoading({message: item.path});
    const result: any = await form.http({select: form.rest, data: {index: form.body.params.index}, qs: {action: 'sendmail', email: params.data.values.email}, type: 'blob'});
    await form.showSuccess({message: item.path, value: form.body, result});
  } catch (error: any) {
    await form.showWarning({message: item.path, value: form.body, error});
  }
}
