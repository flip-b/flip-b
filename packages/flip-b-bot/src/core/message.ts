/**
 * Message
 */
export class Message {
  private _id = '';
  private _parent = '';
  private _ticket = '';
  private _source = '';
  private _target = '';
  private _type = '';
  private _time = 0;
  private _text = '';
  private _file = '';
  private _data: any[] = [];
  private _menu: any[] = [];
  private _form: any[] = [];
  private _action = '';
  private _intent = '';
  private _status = '';
  private _language = '';
  private _settings: any = {};
  private _incoming: any = {};

  /**
   * Constructor
   *
   * Status:
   * - "sent": Message has been submitted to the carrier for delivery.
   * - "delivered": confirmation the message has reached the recipient's but fails to show if it has been "seen" yet.
   * - "failed": Service provider did not accept the message of the carrier and delivery is not possible.
   */
  constructor(message: any = {}) {
    this.language = message.language || 'en-US';
    this.settings = message.settings || {};
    this.incoming = message.incoming || {};

    this.id = message.id || '';
    this.parent = message.parent || '';
    this.ticket = message.ticket || '';
    this.source = message.source || '';
    this.target = message.target || '';
    this.type = message.type || '';
    this.time = message.time || 0;
    this.text = message.text || '';
    this.file = message.file || '';
    this.data = message.data || [];
    this.menu = message.menu || [];
    this.form = message.form || [];
    this.intent = message.intent || '';
    this.action = message.action || '';
    this.status = message.status || 'sent';
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
    this._id = `${value || ''}`.trim();

    if (!this._id) {
      this._id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: any) => {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
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
   * Get time
   */
  get time(): number {
    return this._time;
  }

  /**
   * Set time
   */
  set time(value: number) {
    this._time = value || Date.now();
  }

  /**
   * Get text
   */
  get text(): string {
    return this._text;
  }

  /**
   * Set text
   */
  set text(value: string) {
    this._text = this.formatText(`${value || ''}`);
  }

  /**
   * Get file
   */
  get file(): string {
    return this._file;
  }

  /**
   * Set file
   */
  set file(value: string) {
    this._file = this.formatFile(`${value || ''}`);
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
    this._data = this.formatData(items);
  }

  /**
   * Get menu
   */
  get menu(): any[] {
    return this._menu;
  }

  /**
   * Set menu
   */
  set menu(items: any[]) {
    this._menu = this.formatMenu(items);
  }

  /**
   * Get form
   */
  get form(): any[] {
    return this._form;
  }

  /**
   * Set form
   */
  set form(items: any[]) {
    this._form = this.formatForm(items);
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
   * Get data object
   */
  getDataObject(): any {
    return this.data.reduce((a: any, v: any) => ({...a, [v.index]: v.value}), {}) || {};
  }

  /**
   * Get data value by index
   */
  getDataValueByIndex(index: string): any {
    return (this.data.find((o) => o.index == index) || {}).value || '';
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
   * Format data
   */
  formatData(data: any[]): any[] {
    return data;
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
   * Object methods
   */
  toObject(): any {
    const result: any = {
      id: this.id,
      parent: this.parent,
      ticket: this.ticket,
      source: this.source,
      target: this.target,
      type: this.type,
      time: this.time,
      text: this.text,
      file: this.file,
      data: this.data,
      menu: this.menu,
      form: this.form,
      action: this.action,
      intent: this.intent,
      status: this.status,
      language: this.language,
      settings: this.settings,
      incoming: this.incoming
    };
    for (const k of Object.keys(result)) {
      if (typeof result[`${k}`] == 'string' && result[`${k}`] === '') {
        delete result[`${k}`];
        continue;
      }
      if (typeof result[`${k}`] == 'number' && result[`${k}`] === 0) {
        delete result[`${k}`];
        continue;
      }
      if (typeof result[`${k}`] == 'object' && Object.keys(result[`${k}`]).length == 0) {
        delete result[`${k}`];
        continue;
      }
    }
    return result;
  }
}
