/**
 * Message
 */
export class Message {
  // Message definitions

  /**
   * Id
   */
  private _id = '';

  /**
   * Parent Id
   */
  private _parent = '';

  /**
   * Ticket Id
   */
  private _ticket = '';

  /**
   * Origin Id
   */
  private _origin = '';

  /**
   * Source (plugin name)
   */
  private _source = '';

  /**
   * Target (plugin name)
   */
  private _target = '';

  /**
   * Holder
   */
  private _holder = '';

  /**
   * Status
   */
  private _status = '';

  /**
   * Action
   */
  private _action = '';

  /**
   * Intent
   */
  private _intent = '';

  /**
   * Text
   */
  private _text = '';

  /**
   * File
   */
  private _file = '';

  /**
   * Menu
   */
  private _menu: any[] = [];

  /**
   * Form
   */
  private _form: any[] = [];

  /**
   * Data
   */
  private _data: any[] = [];

  /**
   * Feel
   */
  private _feel = '';

  /**
   * Tags
   */
  private _tags = [];

  /**
   * Time
   */
  private _time = 0;

  /**
   * Type
   */
  private _type = '';

  /**
   * Delivery
   */
  private _delivery = '';

  /**
   * User
   */
  private _user: any = {};

  /**
   * Customer
   */
  private _customer: any = {};

  /**
   * Settings
   */
  private _settings: any = {};

  /**
   * Incoming
   */
  private _incoming: any = {};

  /**
   * Language
   */
  private _language = '';

  /**
   * Constructor
   */
  constructor(message: any = {}) {
    this.id = message.id || '';
    this.parent = message.parent || '';
    this.ticket = message.ticket || '';
    this.origin = message.origin || '';
    this.source = message.source || '';
    this.target = message.target || '';
    this.holder = message.holder || '';
    this.status = message.status || '';
    this.action = message.action || '';
    this.intent = message.intent || '';
    this.text = message.text || '';
    this.file = message.file || '';
    this.menu = message.menu || [];
    this.form = message.form || [];
    this.data = message.data || [];
    this.feel = message.feel || '';
    this.tags = message.tags || [];
    this.time = message.time || Date.now();
    this.type = message.type || '';
    this.delivery = message.delivery || '';
    this.user = message.user || {};
    this.customer = message.customer || {};
    this.settings = message.settings || {};
    this.incoming = message.incoming || {};
    this.language = message.language || 'en-US';
  }

  /**
   * Get id
   */
  get id(): string {
    return this._id;
  }

  /**
   * Set id
   */
  set id(value: string) {
    this._id = `${value || ''}`.trim() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: any) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Get parent
   */
  get parent(): string {
    return this._parent;
  }

  /**
   * Set parent
   */
  set parent(value: string) {
    this._parent = `${value || ''}`.trim();
  }

  /**
   * Get ticket
   */
  get ticket(): string {
    return this._ticket;
  }

  /**
   * Set ticket
   */
  set ticket(value: string) {
    this._ticket = `${value || ''}`.trim();
  }

  /**
   * Get origin
   */
  get origin(): string {
    return this._origin;
  }

  /**
   * Set origin
   */
  set origin(value: string) {
    this._origin = `${value || ''}`.trim();
  }

  /**
   * Get source
   */
  get source(): string {
    return this._source;
  }

  /**
   * Set source
   */
  set source(value: string) {
    this._source = `${value || ''}`.toLowerCase().trim();
  }

  /**
   * Get target
   */
  get target(): string {
    return this._target;
  }

  /**
   * Set target
   */
  set target(value: string) {
    this._target = `${value || ''}`.toLowerCase().trim();
  }

  /**
   * Get holder
   */
  get holder(): string {
    return this._holder;
  }

  /**
   * Set status
   */
  set holder(value: string) {
    this._holder = `${value || ''}`.toLowerCase().trim();
  }

  /**
   * Get status
   */
  get status(): string {
    return this._status;
  }

  /**
   * Set status
   */
  set status(value: string) {
    this._status = `${value || ''}`.toLowerCase().trim();
  }

  /**
   * Get action
   */
  get action(): string {
    return this._action;
  }

  /**
   * Set action
   */
  set action(value: string) {
    this._action = `${value || ''}`.toLowerCase().trim();
  }

  /**
   * Get intent
   */
  get intent(): string {
    return this._intent;
  }

  /**
   * Set intent
   */
  set intent(value: string) {
    this._intent = `${value || ''}`.toLowerCase().trim();
  }

  /**
   * Get text
   */
  get text(): string {
    return this.formatText(this._text);
  }

  /**
   * Set text
   */
  set text(value: string) {
    this._text = `${value || ''}`.trim();
  }

  /**
   * Get file
   */
  get file(): string {
    return this.formatFile(this._file);
  }

  /**
   * Set file
   */
  set file(value: string) {
    this._file = `${value || ''}`.trim();
  }

  /**
   * Get menu
   */
  get menu(): any[] {
    return this.formatMenu(this._menu);
  }

  /**
   * Set menu
   */
  set menu(items: any[]) {
    this._menu = items;
  }

  /**
   * Get form
   */
  get form(): any[] {
    return this.formatForm(this._form);
  }

  /**
   * Set form
   */
  set form(items: any[]) {
    this._form = items;
  }

  /**
   * Get data
   */
  get data(): any[] {
    return this._data;
  }

  /**
   * Set data
   */
  set data(items: any[]) {
    this._data = items;
  }

  /**
   * Get feel
   */
  get feel(): string {
    return this._feel;
  }

  /**
   * Set feel
   */
  set feel(value: string) {
    this._feel = `${value || ''}`.trim();
  }

  /**
   * Get tags
   */
  get tags(): any[] {
    return this._tags;
  }

  /**
   * Set data
   */
  set tags(items: any[]) {
    this._tags = items;
  }

  /**
   * Get time
   */
  get time(): number {
    return this._time;
  }

  /**
   * Set time
   */
  set time(value: number) {
    this._time = value;
  }

  /**
   * Get type
   */
  get type(): string {
    return this._type;
  }

  /**
   * Set type
   */
  set type(value: string) {
    this._type = `${value || ''}`.toLowerCase().trim();
  }

  /**
   * Get delivery
   */
  get delivery(): string {
    return this._delivery;
  }

  /**
   * Set delivery
   */
  set delivery(value: string) {
    this._delivery = `${value || ''}`.toLowerCase().trim();
  }

  /**
   * Get user
   */
  get user(): any {
    return this._user;
  }

  /**
   * Set user
   */
  set user(value: any) {
    this._user = value;
  }

  /**
   * Get customer
   */
  get customer(): any {
    return this._customer;
  }

  /**
   * Set customer
   */
  set customer(value: any) {
    this._customer = value;
  }

  /**
   * Get settings
   */
  get settings(): any {
    return this._settings;
  }

  /**
   * Set settings
   */
  set settings(value: any) {
    this._settings = value;
  }

  /**
   * Get incoming
   */
  get incoming(): any {
    return this._incoming;
  }

  /**
   * Set incoming
   */
  set incoming(value: any) {
    this._incoming = value;
  }

  /**
   * Get language
   */
  get language(): string {
    return this._language;
  }

  /**
   * Set language
   */
  set language(value: string) {
    this._language = `${value || ''}`.trim();
  }

  /**
   * To object
   */
  toObject(): any {
    const result: any = {
      id: this.id,
      parent: this.parent,
      ticket: this.ticket,
      origin: this.origin,
      source: this.source,
      target: this.target,
      holder: this.holder,
      status: this.status,
      action: this.action,
      intent: this.intent,
      text: this.text,
      file: this.file,
      menu: this.menu,
      form: this.form,
      data: this.data,
      feel: this.feel,
      tags: this.tags,
      time: this.time,
      type: this.type,
      delivery: this.delivery,
      user: this.user,
      customer: this.customer,
      settings: this.settings,
      incoming: this.incoming,
      language: this.language
    };
    for (const k of Object.keys(result)) {
      if (typeof result[`${k}`] === 'undefined') {
        delete result[`${k}`];
      } if (typeof result[`${k}`] === 'string' && result[`${k}`] === '') {
        delete result[`${k}`];
      } if (typeof result[`${k}`] === 'number' && result[`${k}`] === 0) {
        delete result[`${k}`];
      } if (typeof result[`${k}`] === 'object' && Array.isArray(result[`${k}`]) && !result[`${k}`].length) {
        delete result[`${k}`];
      } if (typeof result[`${k}`] === 'object' && !Object.keys(result[`${k}`]).length) {
        delete result[`${k}`];
      }
    }
    return result;
  }

  /**
   * Clone
   */
  clone(value: any = {}): Message {
    const message: any = {};
    message.parent = value.parent || this.id;
    message.ticket = value.ticket || this.ticket;
    message.origin = value.origin || this.origin;
    message.source = value.source || this.source;
    message.target = value.target || this.target;
    message.holder = value.holder || this.holder;
    message.status = value.status || this.status;
    message.action = value.action || this.action;
    message.intent = value.intent || this.intent;
    message.text = value.text;
    message.file = value.file;
    message.menu = value.menu;
    message.form = value.form;
    message.data = value.data;
    message.feel = value.feel;
    message.tags = value.tags;
    message.time = value.time;
    message.type = value.type;
    message.delivery = value.delivery;
    message.user = value.user || this.user;
    message.customer = value.customer || this.customer;
    message.settings = value.settings || this.settings;
    message.incoming = value.incoming || this.toObject();
    message.language = value.language || this.language;
    return new Message(message);
  }

  /**
   * Format text
   */
  formatText(text: any): any {
    return (text || '').replace(/@[A-Za-z0-9_]+/g, (match: any): string => {
      const index = `${match}`.replace(/^@/, '');
      return this.settings.customer && this.settings.customer[`${index}`] ? this.settings.customer[`${index}`] : match;
    });
  }

  /**
   * Format file
   */
  formatFile(file: any): any {
    return file;
  }

  /**
   * Format menu
   */
  formatMenu(menu: any[]): any[] {
    if (menu) {
      for (const item of menu) {
        if (item) {
          item.text = this.formatText(item.text || '');
          item.help = this.formatText(item.help || '');
        }
      }
    }
    return menu;
  }

  /**
   * Format form
   */
  formatForm(form: any): any {
    if (form) {
      for (const item of form) {
        if (item) {
          item.text = this.formatText(item.text || '');
          item.help = this.formatText(item.help || '');
        }
      }
    }
    return form;
  }

  /**
   * Get data object
   */
  getDataObject(): any {
    return this.data.reduce((a: any, v: any) => ({...a, [v.index]: v.value}), {}) || {};
  }

  /**
   * Get data value by index
   */
  getDataValueByIndex(index: string): any {
    return (this.data.find((o) => o.index === index) || {}).value || '';
  }
}
