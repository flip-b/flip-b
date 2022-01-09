import { Bot } from './bot';
import * as uuid from 'uuid';

/**
 * Message
 */
export class Message {
  private _id = '';
  private _ticketId = '';
  private _source = '';
  private _sourceId = '';
  private _sourceName = '';
  private _sourcePhone = '';
  private _sourceEmail = '';
  private _sourceImage = '';
  private _sourceNotes = '';
  private _target = '';
  private _targetId = '';
  private _targetName = '';
  private _targetPhone = '';
  private _targetEmail = '';
  private _targetImage = '';
  private _targetNotes = '';
  private _type = '';
  private _text = '';
  private _file = '';
  private _menu: any[] = [];
  private _form: any[] = [];
  private _data: any[] = [];
  private _action = '';
  private _intent = '';
  private _settings: any = {};
  private _datetime = 0;
  private _wait = 0;

  /**
   * Constructor
   */
  constructor(message: any = {}) {
    this.id = message.id || '';
    this.ticketId = message.ticketId || '';
    this.source = message.source || '';
    this.sourceId = message.sourceId || '';
    this.sourceName = message.sourceName || '';
    this.sourcePhone = message.sourcePhone || '';
    this.sourceEmail = message.sourceEmail || '';
    this.sourceImage = message.sourceImage || '';
    this.sourceNotes = message.sourceNotes || '';
    this.target = message.target || '';
    this.targetId = message.targetId || '';
    this.targetName = message.targetName || '';
    this.targetPhone = message.targetPhone || '';
    this.targetEmail = message.targetEmail || '';
    this.targetImage = message.targetImage || '';
    this.targetNotes = message.targetNotes || '';
    this.type = message.type || '';
    this.text = message.text || '';
    this.file = message.file || '';
    this.menu = message.menu || [];
    this.form = message.form || [];
    this.data = message.data || [];
    this.intent = message.intent || '';
    this.action = message.action || '';
    this.settings = message.settings || {};
    this.datetime = message.datetime || 0;
    this.wait = message.wait || 0;
  }

  /*
   * Id methods
   */

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = `${value || ''}`.trim() || `${uuid.v4()}`;
  }

  /*
   * Ticket methods
   */

  get ticketId(): string {
    return this._ticketId;
  }

  set ticketId(value: string) {
    this._ticketId = `${value || ''}`.trim();
  }

  /*
   * Source methods
   */

  get source(): string {
    return this._source;
  }

  set source(value: string) {
    this._source = `${value || ''}`.trim();
  }

  get sourceId(): string {
    return this._sourceId;
  }

  set sourceId(value: string) {
    this._sourceId = `${value || ''}`.trim();
  }

  get sourceName(): string {
    return this._sourceName;
  }

  set sourceName(value: string) {
    this._sourceName = `${value || ''}`.trim();
  }

  get sourcePhone(): string {
    return this._sourcePhone;
  }

  set sourcePhone(value: string) {
    this._sourcePhone = `${value || ''}`.trim();
  }

  get sourceEmail(): string {
    return this._sourceEmail;
  }

  set sourceEmail(value: string) {
    this._sourceEmail = `${value || ''}`.trim().toLowerCase();
  }

  get sourceImage(): string {
    return this._sourceImage;
  }

  set sourceImage(value: string) {
    this._sourceImage = `${value || ''}`.trim();
  }

  get sourceNotes(): string {
    return this._sourceNotes;
  }

  set sourceNotes(value: string) {
    this._sourceNotes = `${value || ''}`.trim();
  }

  /*
   * Target methods
   */

  get target(): string {
    return this._target;
  }

  set target(value: string) {
    this._target = `${value || ''}`.trim();
  }

  get targetId(): string {
    return this._targetId;
  }

  set targetId(value: string) {
    this._targetId = `${value || ''}`.trim();
  }

  get targetName(): string {
    return this._targetName;
  }

  set targetName(value: string) {
    this._targetName = `${value || ''}`.trim();
  }

  get targetPhone(): string {
    return this._targetPhone;
  }

  set targetPhone(value: string) {
    this._targetPhone = `${value || ''}`.trim();
  }

  get targetEmail(): string {
    return this._targetEmail;
  }

  set targetEmail(value: string) {
    this._targetEmail = `${value || ''}`.trim().toLowerCase();
  }

  get targetImage(): string {
    return this._targetImage;
  }

  set targetImage(value: string) {
    this._targetImage = `${value || ''}`.trim();
  }

  get targetNotes(): string {
    return this._targetNotes;
  }

  set targetNotes(value: string) {
    this._targetNotes = `${value || ''}`.trim();
  }

  /*
   * Type methods
   */

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = `${value || ''}`.trim();
  }

  /*
   * Text methods
   */

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = `${value || ''}`.trim();
  }

  /*
   * File methods
   */

  get file(): string {
    return this._file;
  }

  set file(value: string) {
    this._file = `${value || ''}`.trim();
  }

  /*
   * Menu methods
   */

  get menu(): any[] {
    return this._menu;
  }

  set menu(items: any[]) {
    this._menu = items;
  }

  /*
   * Form methods
   */

  get form(): any[] {
    return this._form;
  }

  set form(items: any[]) {
    this._form = items;
  }

  /*
   * Data methods
   */

  get data(): any[] {
    return this._data;
  }

  set data(items: any[]) {
    this._data = items;
  }

  /*
   * Action methods
   */

  get action(): string {
    return this._action;
  }

  set action(value: string) {
    this._action = `${value || ''}`.trim();
  }

  /*
   * Intent methods
   */

  get intent(): string {
    return this._intent;
  }

  set intent(value: string) {
    this._intent = `${value || ''}`.trim();
  }

  /*
   * Settings methods
   */

  get settings(): any {
    return this._settings;
  }

  set settings(value: any) {
    this._settings = value;
  }

  /*
   * Datetime methods
   */

  set datetime(value: number) {
    this._datetime = value || Date.now();
  }

  get datetime(): number {
    return this._datetime;
  }

  /*
   * Wait methods
   */

  set wait(value: number) {
    this._wait = value || 0;
  }

  get wait(): number {
    return this._wait;
  }

  /*
   * Support methods
   */

  getFileName(): string {
    return ((this._file || '').split('/').pop() || '').split('.').shift() || '';
  }

  getFileType(): string {
    return ((this._file || '').split('.').pop() || '').split('?').shift() || '';
  }

  async uploadFile() {
    console.log(this._file);
  }

  getDataValueByIndex(index: string): any {
    return (this.data.find((o) => o.index == index) || {}).value || '';
  }

  /*
   * Object methods
   */

  toObject(): any {
    const result: any = {
      id: this.id,
      ticketId: this.ticketId,
      source: this.source,
      sourceId: this.sourceId,
      sourceName: this.sourceName,
      sourcePhone: this.sourcePhone,
      sourceEmail: this.sourceEmail,
      sourceImage: this.sourceImage,
      sourceNotes: this.sourceNotes,
      target: this.target,
      targetId: this.targetId,
      targetName: this.targetName,
      targetPhone: this.targetPhone,
      targetEmail: this.targetEmail,
      targetImage: this.targetImage,
      targetNotes: this.targetNotes,
      type: this.type,
      text: this.text,
      file: this.file,
      menu: this.menu,
      form: this.form,
      data: this.data,
      action: this.action,
      intent: this.intent,
      settings: this.settings,
      datetime: this.datetime
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

  async dispatchIncoming(bot: Bot): Promise<any> {
    this.type = 'incoming';
    bot.plugins[`${this.target}`].dispatchIncomingMessage(this);
  }

  async dispatchOutgoing(bot: Bot): Promise<any> {
    this.type = 'outgoing';
    bot.plugins[`${this.source}`].dispatchOutgoingMessage(this);
  }

  async execute(bot: Bot): Promise<any> {
    const outgoingMessages: any[] = [];

    if (this.wait) {
      await bot.addOutgoingMessages([{ source: this.source, sourceId: this.sourceId, action: 'talking' }]);
    }

    if (this.action && bot.actions[`${this.action}`]) {
      const messages: any[] = (await bot.actions[`${this.action}`](this)) || [];
      messages.map((m: any) => outgoingMessages.push(m));
    }

    if (this.intent && bot.intents[`${this.intent}`]) {
      const messages: any[] = (await bot.intents[`${this.intent}`](this)) || [];
      messages.map((m: any) => outgoingMessages.push(m));
    }

    if (this.intent && !bot.intents[`${this.intent}`] && bot.actions[`default`]) {
      const messages: any[] = (await bot.actions[`default`](this)) || [];
      messages.map((m: any) => outgoingMessages.push(m));
    }

    if (this.wait) {
      await bot.wait(this.wait);
    }

    if (outgoingMessages.length > 0) {
      for (const message of outgoingMessages) {
        message.ticketId = this.ticketId;
        message.source = this.source;
        message.sourceId = this.sourceId;
        message.target = this.target;
        message.targetId = this.targetId;
      }
      await bot.addOutgoingMessages(outgoingMessages);
    } else if (this.wait) {
      await bot.addOutgoingMessages([{ source: this.source, sourceId: this.sourceId, action: 'silence' }]);
    }
  }
}
