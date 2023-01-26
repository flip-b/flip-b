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
  private _action: any = undefined;

  /**
   * Intent
   */
  private _intent: any = undefined;

  /**
   * Text
   */
  private _text: any = undefined;

  /**
   * File
   */
  private _file: any = undefined;

  /**
   * Menu
   */
  private _menu: any = undefined;

  /**
   * Form
   */
  private _form: any = undefined;

  /**
   * Data
   */
  private _data: any = undefined;

  /**
   * Feel
   */
  private _feel: any = undefined;

  /**
   * Tags
   */
  private _tags: any = undefined;

  /**
   * Time
   */
  private _time = 0;

  /**
   * Type
   */
  private _type: any = undefined;

  /**
   * Language
   */
  private _language: any = undefined;

  /**
   * Delivery
   */
  private _delivery: any = undefined;

  /**
   * Customer
   */
  private _customer: any = undefined;

  /**
   * Operator
   */
  private _operator: any = undefined;

  /**
   * Settings
   */
  private _settings: any = undefined;

  /**
   * Incoming
   */
  private _incoming: any = undefined;

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
    this.action = message.action;
    this.intent = message.intent;
    this.text = message.text;
    this.file = message.file;
    this.menu = message.menu;
    this.form = message.form;
    this.data = message.data;
    this.feel = message.feel;
    this.tags = message.tags;
    this.time = message.time || Date.now();
    this.type = message.type;
    this.language = message.language;
    this.delivery = message.delivery;
    this.customer = message.customer;
    this.operator = message.operator;
    this.settings = message.settings;
    this.incoming = message.incoming;
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
    this._id =
      `${value || ''}`.trim() ||
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: any) => {
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
  get action(): any {
    return this._action;
  }

  /**
   * Set action
   */
  set action(value: any) {
    this._action = `${value || ''}`.toLowerCase().trim() || undefined;
  }

  /**
   * Get intent
   */
  get intent(): any {
    return this._intent;
  }

  /**
   * Set intent
   */
  set intent(value: any) {
    this._intent = `${value || ''}`.toLowerCase().trim() || undefined;
  }

  /**
   * Get text
   */
  get text(): any {
    return this._text;
  }

  /**
   * Set text
   */
  set text(value: any) {
    if (typeof value === 'object' && Array.isArray(value)) {
      value = value[Math.floor(Math.random() * value.length)];
    }
    this._text = `${value || ''}`.trim() || undefined;
  }

  /**
   * Get file
   */
  get file(): any {
    return this._file;
  }

  /**
   * Set file
   */
  set file(value: any) {
    if (typeof value === 'object' && Array.isArray(value)) {
      value = value[Math.floor(Math.random() * value.length)];
    }
    this._file = `${value || ''}`.trim() || undefined;
  }

  /**
   * Get menu
   */
  get menu(): any {
    return this._menu;
  }

  /**
   * Set menu
   */
  set menu(value: any) {
    this._menu = value;
  }

  /**
   * Get form
   */
  get form(): any {
    return this._form;
  }

  /**
   * Set form
   */
  set form(value: any) {
    this._form = value;
  }

  /**
   * Get data
   */
  get data(): any {
    return this._data;
  }

  /**
   * Set data
   */
  set data(value: any) {
    this._data = value;
  }

  /**
   * Get feel
   */
  get feel(): any {
    return this._feel;
  }

  /**
   * Set feel
   */
  set feel(value: any) {
    this._feel = value;
  }

  /**
   * Get tags
   */
  get tags(): any {
    return this._tags;
  }

  /**
   * Set data
   */
  set tags(value: any) {
    this._tags = value;
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
  get type(): any {
    return this._type;
  }

  /**
   * Set type
   */
  set type(value: any) {
    this._type = value;
  }

  /**
   * Get language
   */
  get language(): any {
    return this._language;
  }

  /**
   * Set language
   */
  set language(value: any) {
    this._language = value;
  }

  /**
   * Get delivery
   */
  get delivery(): any {
    return this._delivery;
  }

  /**
   * Set delivery
   */
  set delivery(value: any) {
    this._delivery = value;
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
   * Get operator
   */
  get operator(): any {
    return this._operator;
  }

  /**
   * Set operator
   */
  set operator(value: any) {
    this._operator = value;
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
      language: this.language,
      delivery: this.delivery,
      customer: this.customer,
      operator: this.operator,
      settings: this.settings,
      incoming: this.incoming
    };
    for (const k of Object.keys(result)) {
      if (typeof result[`${k}`] === 'undefined') {
        delete result[`${k}`];
      }
      if (typeof result[`${k}`] === 'string' && result[`${k}`] === '') {
        delete result[`${k}`];
      }
      if (typeof result[`${k}`] === 'number' && result[`${k}`] === 0) {
        delete result[`${k}`];
      }
      if (typeof result[`${k}`] === 'object' && Array.isArray(result[`${k}`]) && !result[`${k}`].length) {
        delete result[`${k}`];
      }
      if (typeof result[`${k}`] === 'object' && !Object.keys(result[`${k}`]).length) {
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
    message.language = value.language || this.language;
    message.delivery = value.delivery;
    message.customer = value.customer || this.customer;
    message.operator = value.operator || this.operator;
    message.settings = value.settings || this.settings;
    message.incoming = value.incoming || this.toObject();
    return new Message(message);
  }
}
