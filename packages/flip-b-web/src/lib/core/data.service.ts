import {Injectable, Inject} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoadingController, AlertController, ModalController, ToastController, MenuController, Platform} from '@ionic/angular';

declare global {
  interface Window {
    form: any;
    formTelLib: any;
    formMapLib: any;
    formValues: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Definitions

  /**
   * User
   */
  user: any = {};

  /**
   * Http
   */
  http: any = {};

  /**
   * I18n
   */
  i18n: any = {};

  /**
   * Menu
   */
  menu: any = {};

  /**
   * Page
   */
  page: any = {};

  /**
   * Info
   */
  info: any = {};

  /**
   * History
   */
  private _history: any = [];

  /**
   * Loading
   */
  private _loading: any = false;

  /**
   * Constructor
   */
  constructor(
    @Inject('config') public _config: any = {},
    private _httpClient: HttpClient,
    private _loadingController: LoadingController,
    private _ionMenu: MenuController,
    private _ionAlert: AlertController,
    private _ionModal: ModalController,
    private _ionToast: ToastController,
    private _ionPlatform: Platform,
    private _router: Router
  ) {
    // Define pause event handler (only Cordova)
    this._ionPlatform.pause.subscribe(async () => {
      console.info('Pause event detected');
    });

    // Define resume event handler (only Cordova)
    this._ionPlatform.resume.subscribe(async () => {
      console.info('Resume event detected');
    });

    // Define resize event handler
    this._ionPlatform.resize.subscribe(async () => {
      console.info('Resize event detected');
    });

    // Define router eventr event handler
    this._router.events.subscribe(async (event: any): Promise<any> => {
      if (event instanceof NavigationEnd && event.url) {
        this._history.push(event.urlAfterRedirects);
        this._history = this._history.slice(-10);
      }
    });

    // Init
    this._init();
  }

  /**
   * Initialize
   */
  private async _init(): Promise<any> {
    // Initialize

    // Define info config
    Object.defineProperty(this.info, 'config', {value: {}, writable: true, enumerable: false});
    this.info.config.code = this._config.code || 'flip-b';
    this.info.config.user = {...this._config.user};
    this.info.config.http = {...this._config.http};
    this.info.config.i18n = {...this._config.i18n};
    this.info.config.menu = {...this._config.menu};
    this.info.config.page = {...this._config.page};

    // Define info storage
    if (localStorage.getItem(`${this.info.config.code}-user-remember`) === '1') {
      Object.defineProperty(this.info, 'storage', {value: localStorage, writable: true, enumerable: false});
    } else {
      Object.defineProperty(this.info, 'storage', {value: sessionStorage, writable: true, enumerable: false});
    }

    // Define info methods
    this.info.getItem = (index: string): any => {
      return this.info.storage.getItem(`${this.info.config.code}-${index}`);
    };
    this.info.setItem = (index: string, value: string): any => {
      this.info.storage.setItem(`${this.info.config.code}-${index}`, `${value || ''}`);
    };
    this.info.delItem = (index: string): any => {
      this.info.storage.removeItem(`${this.info.config.code}-${index}`);
    };
    this.info.clear = (): any => {
      window.sessionStorage.clear();
      window.localStorage.clear();
    };

    //window.localStorage.setItem(`${this.info.config.code}-user-remember`, '1');

    // Define user
    const user: any = JSON.parse(this.info.getItem('user') || '{}');

    // Define user access
    Object.defineProperty(this.user, 'access', {value: {...(user.access || {})}, writable: true, enumerable: false});

    // Define user config
    Object.defineProperty(this.user, 'config', {value: {...(user.config || {})}, writable: true, enumerable: false});

    // Define user values
    Object.defineProperty(this.user, 'values', {value: {...(user.values || {})}, writable: true, enumerable: false});

    // Define user methods
    this.user.auth = (path: string, params: any = {}) => this._userAuth(path, params);
    this.user.goto = (path: string, params: any = {}) => this._userGoto(path, params);
    this.user.update = (user: any) => this._userUpdate(user);
    this.user.delete = () => this._userDelete();

    // Define http
    const httpUser: any = this.user.config.http || {};
    const httpInfo: any = this.info.config.http || {};

    // Define http config
    Object.defineProperty(this.http, 'config', {value: {}, writable: true, enumerable: false});
    this.http.config.url = httpUser.url || httpInfo.url || '';
    this.http.config.uri = httpUser.uri || httpInfo.uri || '';
    this.http.config.headers = httpUser.headers || httpInfo.headers || {};

    // Define http methods
    this.http.request = (params: any) => this._httpRequest(params);

    // Define i18n
    const i18nUser: any = this.user.config.i18n || {};
    const i18nInfo: any = this.info.config.i18n || {};

    // Define i18n config
    Object.defineProperty(this.i18n, 'config', {value: {}, writable: true, enumerable: false});
    this.i18n.config.language = i18nUser.language || i18nInfo.language || 'es';
    this.i18n.config.region = i18nUser.region || i18nInfo.region || 'AR';
    this.i18n.config.locale = i18nUser.locale || i18nInfo.locale || 'es-AR-u-hc-h23';
    this.i18n.config.format = {};

    // Define i18n date format
    this.i18n.config.format['date-format'] = '{DD}/{MM}/{YYYY}';
    this.i18n.config.format['date-locale'] = '{YYYY}-{MM}-{DD}';

    // Define i18n datetime format
    this.i18n.config.format['datetime-format'] = '{DD}/{MM}/{YYYY} {hh}:{mm}';
    this.i18n.config.format['datetime-locale'] = '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{ms}{TZ}';

    // Define i18n time format
    this.i18n.config.format['time-format'] = '{hh}:{mm}';
    this.i18n.config.format['time-locale'] = '{hh}:{mm}';

    // Define i18n year format
    this.i18n.config.format['year-format'] = '{YYYY}';
    this.i18n.config.format['year-locale'] = '{YYYY}';

    // Define i18n year-month format
    this.i18n.config.format['year-month-format'] = '{MM}/{YYYY}';
    this.i18n.config.format['year-month-locale'] = '{YYYY}-{MM}';

    // Define i18n decimal format
    this.i18n.config.format['decimal-format'] = '{SN}{IV}{DS}{DV}';
    this.i18n.config.format['decimal-symbol'] = ',';
    this.i18n.config.format['decimal-digits'] = '2';

    // Define i18n integer format
    this.i18n.config.format['integer-format'] = '{SN}{IV}';
    this.i18n.config.format['integer-symbol'] = '.';
    this.i18n.config.format['integer-digits'] = '3';

    // Define i18n percent format
    this.i18n.config.format['percent-format'] = '{SN}{IV}{DS}{DV}{PS}';
    this.i18n.config.format['percent-symbol'] = '%';

    // Define i18n currency format
    this.i18n.config.format['currency-format'] = '{SN}{CS} {IV}{DS}{DV}';
    this.i18n.config.format['currency-symbol'] = '$';

    // Define i18n quantity format
    this.i18n.config.format['quantity-format'] = '{SN}{IV}{DS}{DV}{QS}';
    this.i18n.config.format['quantity-symbol'] = 'u';

    // Define i18n negative and positive symbols
    this.i18n.config.format['negative-symbol'] = '-';
    this.i18n.config.format['positive-symbol'] = '+';

    // Define i18n values
    Object.defineProperty(this.i18n, 'values', {value: {}, writable: true, enumerable: false});

    // Define i18n values
    //if (!this.i18n.config.language) {
    //  this.i18n.values = await this.http.request({method: 'GET', url: `assets/i18n/${this.i18n.config.language}.json`}).catch(console.error);
    //}
    this.i18n.values = i18nInfo.values || {};

    // Define i18n methods
    this.i18n.text = (value: any, params: any, debug: any) => this._i18nText(value, params, debug);
    this.i18n.pipe = (value: any, params: any) => this._i18nPipe(value, params);
    this.i18n.stringValue = (value: any, params: any) => this._i18nStringValue(value, params);
    this.i18n.stringInput = (value: any, params: any) => this._i18nStringInput(value, params);
    this.i18n.numberValue = (value: any, params: any) => this._i18nNumberValue(value, params);
    this.i18n.numberInput = (value: any, params: any) => this._i18nNumberInput(value, params);
    this.i18n.objectValue = (value: any, params: any) => this._i18nObjectValue(value, params);
    this.i18n.objectInput = (value: any, params: any) => this._i18nObjectInput(value, params);
    this.i18n.isValid = (value: any, params: any) => this._i18nIsValid(value, params);

    // Define menu
    const menuUser: any = this.user.config.menu || {};
    const menuInfo: any = this.info.config.menu || {};

    // Define menu config
    Object.defineProperty(this.menu, 'config', {value: {}, writable: true, enumerable: false});
    this.menu.config.title = menuUser.title || menuInfo.title || this.i18n.text('flip.menu.config.$title');
    this.menu.config.label = menuUser.label || menuInfo.label || this.i18n.text('flip.menu.config.$label');
    this.menu.config.image = menuUser.image || menuInfo.image || this.i18n.text('flip.menu.config.$image');
    this.menu.enable = true;

    // Define menu values
    Object.defineProperty(this.menu, 'values', {value: {}, writable: true, enumerable: false});
    this._menuValues();

    // Define menu methods
    this.menu.toggle = (show: any) => this._menuToggle(show);
    this.menu.isOpen = () => this._menuIsOpen();

    // Define page
    const pageUser: any = this.user.config.page || {};
    const pageInfo: any = this.info.config.page || {};

    // Define page config
    Object.defineProperty(this.page, 'config', {value: {}, writable: true, enumerable: false});
    this.page.config.title = pageInfo.title || pageUser.title || this.i18n.text('flip.page.config.$title');
    this.page.config.label = pageInfo.label || pageUser.label || this.i18n.text('flip.page.config.$label');
    this.page.config.image = pageInfo.image || pageUser.image || this.i18n.text('flip.page.config.$image');
    this.page.config.theme = pageInfo.theme || pageUser.theme || this.i18n.text('flip.page.config.$theme');

    // Define page methods
    this.page.loading = (params: any) => this._pageLoading(params);
    this.page.message = (params: any) => this._pageMessage(params);
    this.page.success = (params: any) => this._pageSuccess(params);
    this.page.warning = (params: any) => this._pageWarning(params);

    this.page.confirm = (params: any) => this._pageAlert(params);
    this.page.alert = (params: any) => this._pageAlert(params);
    this.page.modal = (params: any) => this._pageModal(params);

    this.page.browserDownload = (params: any) => this._pageBrowserDownload(params);
    this.page.browserShare = (params: any) => this._pageBrowserShare(params);
    this.page.browserPrint = (params: any) => this._pageBrowserPrint(params);
    this.page.browserSendmail = (params: any) => this._pageBrowserSendmail(params);

    this.page.snap = async (): Promise<any> => {
      return this._router.routerState.snapshot.root.firstChild;
    };

    // Define html title
    if (this.page.config.title) {
      const $title: any = document.querySelector('title');
      if ($title) {
        $title.innerText = this.page.config.title;
      }
    }

    // Define html color
    if (this.page.config.color) {
      const $color: any = document.querySelector('meta[name=theme-color]');
      if ($color) {
        $color.setAttribute('content', this.page.config.color);
      }
    }

    // Define html icons
    if (this.page.config.image) {
      const $icons: any = document.querySelectorAll('link[rel=icon]');
      if ($icons) {
        [...$icons].map(($icon: any) => $icon.setAttribute('href', this.page.config.image));
      }
    }

    const changeTheme = ({night, color, image}: any) => {
      if (!color || color === 'auto') {
        const match: any = window.matchMedia('(prefers-color-scheme: dark)');
        //match.addListener((media: any) => changeTheme({color: 'auto'}));
        night = match?.matches ? true : false;
        color = night ? '#121212' : '#ffffff';
      }

      // Define theme
      document.body.classList.toggle('flb-theme', true);
      document.body.classList.toggle('flb-theme-light', night ? false : true);
      document.body.classList.toggle('flb-theme-night', night ? true : false);

      // Define image
      document.body.style.setProperty('--flb-background-image', `${image || ''}`);

      // Define color
      document.body.style.setProperty('--flb-background-color', `${color || ''}`);

      // Define color rgb
      const match: any = `${color || ''}`.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      document.body.style.setProperty('--flb-background-color-rgb', match ? `${parseInt(match[1], 16)},${parseInt(match[2], 16)},${parseInt(match[3], 16)}` : '');
    };

    // Define menu classes
    if (this.user.access.auth) {
      document.body.classList.toggle('flb-user', true);
      document.body.classList.toggle('flb-user-anonymous', false);
      document.body.classList.toggle('flb-menu', true);

      const show = await this.menu.isOpen();
      document.body.classList.toggle('flb-menu-show', show === true);
      document.body.classList.toggle('flb-menu-hide', show === false);

      changeTheme(this.page.config.theme || {color: 'auto'});
    } else {
      this.menu.enable = false;
      document.body.classList.toggle('flb-user', false);
      document.body.classList.toggle('flb-user-anonymous', true);
      document.body.classList.toggle('flb-menu', false);
      document.body.classList.toggle('flb-menu-show', false);
      document.body.classList.toggle('flb-menu-hide', false);
      changeTheme(this.page.config.theme || {color: 'auto', image: 'url("https://picsum.photos/1024/768")'});
    }

    window.formTelLib = await loadTelLib();
    window.formMapLib = await loadMapLib();
    window.formValues = {};
  }

  /*********************************************************************************************************************
   *** Support Methods
   ********************************************************************************************************************/

  /**
   * Clone
   */
  clone(value: any = {}): any {
    if (typeof value !== 'object' || value === null || value instanceof RegExp) {
      return value;
    }
    let clone: any;
    if (Array.isArray(value)) {
      clone = [...value];
    } else {
      clone = {...value};
    }
    for (const k in clone) {
      clone[k] = this.clone(clone[k]);
    }
    return clone;
  }

  /**
   * Plain
   */
  plain(value: any = {}, prefix = '', result: any = {}): any {
    if (typeof value !== 'object' || value === null || value instanceof RegExp) {
      return value;
    }
    for (const i in value) {
      if (typeof value[i] === 'object') {
        this.plain(value[i], `${prefix}${i}.`, result);
      } else {
        result[`${prefix}${i}`] = value[i];
      }
    }
    return result;
  }

  /*********************************************************************************************************************
   *** User Methods
   ********************************************************************************************************************/

  /**
   * User Auth
   */
  private async _userAuth(path: any = undefined, params: any = {}): Promise<boolean> {
    if (typeof params.user !== 'undefined') {
      await this.user.update(params.user);
      await this._init();
    }

    path = `${path || ''}`.trim();
    for (const p in params) {
      path = path.replace(new RegExp(':' + p), params[p]);
    }

    for (const view of this._config.page.items) {
      if (view.path === path && view.auth.includes(this.user.access.auth || 'anonymous')) {
        return true;
      }
    }

    return false;
  }

  /**
   * User Goto
   */
  private async _userGoto(path: any = undefined, params: any = {}): Promise<any> {
    if (typeof params.user !== 'undefined') {
      await this.user.update(params.user);
      await this._init();
    }

    path = `${path || ''}`.trim();
    for (const p in params) {
      path = path.replace(new RegExp(':' + p), params[p]);
    }

    return await this._router.navigate([path], {replaceUrl: true, state: params});
  }

  /**
   * User Update
   */
  private async _userUpdate(user: any): Promise<any> {
    this.info.setItem(`user`, JSON.stringify(user || {}));
    await this._init();
  }

  /**
   * User Delete
   */
  private async _userDelete(): Promise<any> {
    this.info.delItem('user');
    this.info.clear();
    await this._init();
  }

  /*********************************************************************************************************************
   *** Http Methods
   ********************************************************************************************************************/

  /**
   * Http Request
   */
  private async _httpRequest(params: any): Promise<any> {
    if (params.search) {
      params.method = 'GET';
      params.url = `${this.http.config.url}`;
      params.uri = `${this.http.config.uri}/${params.search}/`;
    } else if (params.select) {
      params.method = 'GET';
      params.url = `${this.http.config.url}`;
      params.uri = `${this.http.config.uri}/${params.select}/:index`;
    } else if (params.create) {
      params.method = 'POST';
      params.url = `${this.http.config.url}`;
      params.uri = `${this.http.config.uri}/${params.create}/`;
    } else if (params.update) {
      params.method = 'PUT';
      params.url = `${this.http.config.url}`;
      params.uri = `${this.http.config.uri}/${params.update}/:index`;
    } else if (params.delete) {
      params.method = 'DELETE';
      params.url = `${this.http.config.url}`;
      params.uri = `${this.http.config.uri}/${params.delete}/:index`;
    } else if (params.lookup) {
      params.method = 'POST';
      params.url = `${this.http.config.url}`;
      params.uri = `${this.http.config.uri}/${params.lookup}/lookup/:index`;
    } else if (params.upload) {
      params.method = 'POST';
      params.url = `${this.http.config.url}`;
      params.uri = `${this.http.config.uri}/${params.upload}/upload/:index`;
    } else if (params.submit) {
      params.method = 'POST';
      params.url = `${this.http.config.url}`;
      params.uri = `${this.http.config.uri}/${params.submit}`;
    }

    if (params.data) {
      params.uri = (params.uri || '').replace(':index', params.data.index);
    }

    if (params.type === 'blob') {
      params.observe = 'response';
    }

    if (typeof params.body === 'object' && Object.keys(params.body).length) {
      params.body = {...params.body};
    } else {
      params.body = undefined;
    }

    if (typeof params.form === 'object' && Object.keys(params.form).length) {
      const form: FormData = new FormData();
      for (const i in params.form) {
        form.append(i, params.form[i]);
      }
      params.form = form;
    } else {
      params.form = undefined;
    }

    params.headers = {...this.http.config.headers, ...(params.headers || {})};
    for (const h in params.headers) {
      if (!params.headers[h]) {
        delete params.headers[h];
      }
    }

    // Define method
    const method: any = `${params.method || 'GET'}`.toUpperCase().trim();
    const url: any = `${params.url || ''}`.trim();
    const uri: any = `${params.uri || ''}`.trim();
    const qs: any = params.qs ? '?' + this._httpQsObject(params.qs) : '';
    const body: any = params.form || params.body;
    const headers: any = new HttpHeaders(params.headers);
    const observe: any = params.observe || undefined;
    const responseType: any = params.type || undefined;

    return this._httpClient.request(method, `${url}${uri}${qs}`, {body, headers, observe, responseType}).toPromise();

    // Define response$
    //const response$ = this._httpClient.request(method, `${url}${uri}${qs}`, {body, headers, observe, responseType});
    // Return last value from response
    //return lastValueFrom(response$);
  }

  /*********************************************************************************************************************
   *** I18n Methods
   ********************************************************************************************************************/

  /**
   * I18n String Value
   */
  private _i18nStringValue(value: any, params: any = undefined): any {
    if (typeof params === 'string') {
      params = {type: params};
    }

    // Verify object
    if (typeof value === 'object' && value instanceof Date) {
      value = value.toISOString();
    }

    // Verify object
    if (typeof value === 'object') {
      return value;
    }

    // Define config
    const config: any = params.config || this.i18n.config;

    // Define format
    const format: any = config.format;

    // Define result
    let result: any = `${value || ''}`.replace(/\s\s+/g, ' ').trim();

    // Format phone
    if (params.type === 'phone') {
      result = result.replace(/[^0-9]/g, '');
      result = result.length > 3 ? window.formTelLib.parsePhoneNumber(result, config.region).format('INTERNATIONAL') : result;
      result = result.replace(/[^0-9]/g, '');
    }

    // Format email
    if (params.type === 'email') {
      result = result.toLowerCase();
    }

    // Format color
    if (params.type === 'color') {
      result = result.toLowerCase();
    }

    // Format dates
    if (params.type && format[`${params.type}-format`] && params.from !== 'input' && result.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}([.][0-9]{3})?(Z|[+-][0-9]{2}:[0-9]{2})$/)) {
      const tz: Date = new Date(result);
      const lt: Date = new Date(tz.getTime() - tz.getTimezoneOffset() * 60000);
      result = lt.toISOString();
      result = this._i18nDate(result, format[`${params.type}-locale`], '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{ms}{TZ}');
    }

    // Format dates
    if (params.type && format[`${params.type}-format`] && params.from === 'input' && result) {
      result = this._i18nDate(result, format[`${params.type}-locale`], format[`${params.type}-format`]);
    }

    // Verify max length
    if (params.max) {
      result = result.substring(0, params.max);
    }

    // Return result
    return result;
  }

  /**
   * I18n String Input
   */
  private _i18nStringInput(value: any, params: any = undefined): any {
    if (typeof params === 'string') {
      params = {type: params};
    }

    // Verify object
    if (typeof value === 'object' && value instanceof Date) {
      value = value.toISOString();
    }

    // Verify object
    if (typeof value === 'object') {
      value = '';
    }

    // Define config
    const config: any = params.config || this.i18n.config;

    // Define format
    const format: any = config.format;

    // Define result
    let result: any = `${value || ''}`.replace(/\s\s+/g, ' ');

    // Format phone
    if (params.type === 'phone' && ['enter', 'input'].includes(params.from)) {
      result = result.replace(/[^0-9]/g, '');
      return result;
    }

    // Format phone
    if (params.type === 'phone') {
      result = result.replace(/[^0-9]/g, '');
      result = result.length > 3 ? window.formTelLib.parsePhoneNumber(result, config.region).format('INTERNATIONAL') : result;
    }

    // Format email
    if (params.type === 'email') {
      result = result.toLowerCase().trim();
    }

    // Format color
    if (params.type === 'color') {
      result = result.toLowerCase().trim();
    }

    // Format dates
    if (params.type && format[`${params.type}-format`] && params.from === 'input' && result) {
      result = this._i18nMask(result, format[`${params.type}-format`]);
    }

    // Format dates
    if (params.type && format[`${params.type}-locale`] && params.from !== 'input' && result) {
      result = this._i18nDate(result, format[`${params.type}-format`], format[`${params.type}-locale`]);
    }

    // Format case
    if (params.case) {
      result = this._i18nCase(result, params.case);
    }

    // Format mask
    if (params.mask) {
      result = this._i18nMask(result, params.mask);
    }

    // Verify max length
    if (params.max) {
      result = result.substring(0, params.max);
    }

    // Return result
    return result;
  }

  /**
   * I18n Number Value
   */
  private _i18nNumberValue(value: any, params: any = undefined): number {
    if (typeof params === 'string') {
      params = {type: params};
    }

    // Verify max value
    if (params.max && params.max < value) {
      value = params.max;
    }

    // Verify min value
    if (params.min && params.min > value) {
      value = params.min;
    }

    // Define result
    let result: any = `${value || '0'}`;
    result = !Number.isNaN(Number(result)) ? Math.round((Number(result) + Number.EPSILON) * 100) / 100 : 0;

    // Format result
    if (params.type === 'integer') {
      result = Math.round(result);
    }

    // Return result
    return result;
  }

  /**
   * I18n Number Input
   */
  private _i18nNumberInput(value: any, params: any = undefined): any {
    if (typeof params === 'string') {
      params = {type: params};
    }

    // Define result from enter event
    if (params.from === 'enter') {
      value = `${value || '0'}`;
      value = value.replace(/[^0-9-.]/g, '');
      value = value.replace(/^0+/g, '');
      return value;
    }

    // Define result from input event
    if (params.from === 'input') {
      value = `${value || '0'}`;
      value = value.replace(/[^0-9-., ]/g, '');
      value = value.replace(/[^0-9-]/g, '.');
      value = value.replace(/\.\.+/g, '.');
      value = value.replace(/\-\-+/g, '-');
      value = value.replace(/\.([0-9]+)\./g, '$1.');
      value = value.replace(/(.)-/g, '$1');
      value = value.replace(/^0+/g, '');
      value = value.substring(0, 16);
      return value;
    }

    // Verify max value
    if (params.max && params.max < value) {
      value = params.max;
    }

    // Verify min value
    if (params.min && params.min > value) {
      value = params.min;
    }

    // Define config
    const config: any = params.config || this.i18n.config;

    // Define format
    const format: any = config.format;

    // Define parts
    const parts: any = `${value || '0'}`.replace(/[^0-9.]/g, '').split('.');
    const parti = `${parts[0] || '0'}`.replace(new RegExp('\\B(?=(\\d{' + format['integer-digits'] + '})+(?!\\d))', 'g'), '{IS}');
    const partd = `${parts[1] || '0'}000000000000000`.substring(0, parseInt(format['decimal-digits']));

    // Define result
    let result: any = format[`${params.type}-format`];
    result = result.replace('{SN}', value < 0 ? format['negative-symbol'] : '');
    result = result.replace('{SP}', value > 0 ? format['positive-symbol'] : '');
    result = result.replace('{IV}', parti);
    result = result.replace('{DV}', partd);
    result = result.replace(/\{IS\}/g, format['integer-symbol']);
    result = result.replace('{DS}', format['decimal-symbol']);
    result = result.replace('{PS}', format['percent-symbol']);
    result = result.replace('{CS}', format['currency-symbol']);
    result = result.replace('{QS}', format['quantity-symbol']);
    result = result.replace(/\s\s+/g, ' ');
    result = result.trim();

    // Return result
    return result;
  }

  /**
   * I18n Object Value
   */
  private _i18nObjectValue(value: any, params: any = undefined): any {
    if (typeof params === 'object') {
      params = {...this.i18n.config, ...params};
    } else {
      params = {...this.i18n.config, type: `${params || ''}`};
    }

    // Define result
    let result: any = {};
    if (typeof value === 'object') {
      result = {...value};
    }

    // Return result
    return result;
  }

  /**
   * I18n Object Input
   */
  private _i18nObjectInput(value: any, params: any = undefined): any {
    if (typeof params === 'object') {
      params = {...this.i18n.config, ...params};
    } else {
      params = {...this.i18n.config, type: `${params || ''}`};
    }

    // Define result
    let result: any = '';
    if (typeof value === 'object' && params.type === 'address') {
      result = [value.street, value.city, value.state, value.country]
        .filter((v) => !!v)
        .join(', ')
        .trim();
    }

    // Return result
    return result;
  }

  /**
   * I18n Is Valid
   */
  private _i18nIsValid(value: any, params: any = undefined): any {
    if (typeof params === 'object') {
      params = {...this.i18n.config, ...params};
    } else {
      params = {...this.i18n.config, type: `${params || ''}`};
    }
    if (params.pattern && `${value || ''}`.match(params.pattern)) {
      return false;
    }
    if (typeof value === 'string' && params.min && params.min > value.length) {
      return false;
    }
    if (typeof value === 'string' && params.max && params.max < value.length) {
      return false;
    }
    if (typeof value === 'number' && params.min && params.min > value) {
      return false;
    }
    if (typeof value === 'number' && params.max && params.max < value) {
      return false;
    }

    const isValidPhone = (v: any) => {
      return window.formTelLib.parsePhoneNumber(v, this.i18n.config.region).isValid();
    };

    const isValidEmail = (v: any) => {
      return v.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const isValidUrl = (v: any) => {
      const e = new RegExp(
        '^(https?:\\/\\/)?' +
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
          '((\\d{1,3}\\.){3}\\d{1,3}))' +
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
          '(\\?[;&a-z\\d%_.~+=-]*)?' +
          '(\\#[-a-z\\d_]*)?$',
        'i'
      );
      return !!e.test(v);
    };

    if (params.type === 'phone' && !isValidPhone(value)) {
      return false;
    }
    if (params.type === 'email' && !isValidEmail(value)) {
      return false;
    }
    if (params.type === 'website' && !isValidUrl(value)) {
      return false;
    }
    if (params.type === 'address' && !Object.keys(value || {}).length) {
      return false;
    }

    // Return result
    return true;
  }

  /**
   * I18n Pipe
   */
  private _i18nPipe(expr: any, type: any = undefined): any {
    return this._i18nText(expr, type) || expr;
  }

  /**
   * I18n Text
   */
  private _i18nText(expr: any, data: any = undefined, debug: any = undefined): any {
    try {
      const parts = `${expr || ''}`.split('.');

      let dataType = '';
      if (parts[0].match(/^[a-z].+$/)) {
        dataType = parts.pop() || '';
      }

      let formName = '';
      if (parts[0].match(/^[a-z].+$/)) {
        formName = parts.shift() || '';
      }

      let formType = '';
      if (parts[0]?.match(/^\$[a-z].+$/)) {
        formType = parts.shift() || '';
      }

      let itemName = '';
      while (parts[0]?.match(/^[a-z].+$/)) {
        itemName = (itemName ? itemName + '.' : '') + (parts.shift() || '');
      }

      let itemType = '';
      if (parts[0]?.match(/^\$[a-z].+$/)) {
        itemType = parts.shift() || '';
      }

      const search: any = [];
      if (formType && itemName && itemType && dataType) {
        search.push(`${formType}.${itemName}.${itemType}.${dataType}`);
      }
      if (itemName && itemType && dataType) {
        search.push(`${itemName}.${itemType}.${dataType}`);
      }
      if (itemName && dataType) {
        search.push(`${itemName}.${dataType}`);
      }
      if (itemName && dataType === '$content-title') {
        search.push(`${itemName}`);
      }
      if (itemType && dataType) {
        search.push(`${itemType}.${dataType}`);
      }

      let result: any = '';
      for (const x of [formName, '$page']) {
        for (const y of search) {
          if (debug) {
            console.log(x, y)
          }
          if (typeof this.i18n.values[x] === 'object' && typeof this.i18n.values[x][y] !== 'undefined') {
            result = this.i18n.values[x][y];
            break;
          }
        }
        if (result) {
          break;
        }
      }


      if (typeof result !== 'string') {
        return result;
      }

      result = result.replace(/\s\s+/g, ' ').trim();

      if (data) {
        const plain: any = this.plain(data);
        for (const i in plain) {
          result = result.replace(`{{${i}}}`, plain[i]);
        }
      }

      const replacements: any = [...(result.matchAll(/\{\{(.*?)\}\}/g) || [])];
      for (const r of replacements) {
        result = result.replace(r[0], this.i18n.text(formName + '.' + formType + '.' + r[1]));
      }

      result = result.replace(/\{\{.*?\}\}/g, '').trim();
      result = result.replace(/\s\s+/g, ' ').trim();

      // if (type && ['$content-title', '$content-label'].includes(type)) {
      //   result = result.charAt(0).toUpperCase() + result.slice(1);
      //   // result = result.toLowerCase();
      //   // result = result.replace(new RegExp(`(?<=[^A-Za-zÀ-ÖØ-öø-ÿ]|^)[A-Za-zÀ-ÖØ-öø-ÿ]`, 'i'), (m: any) => m.toUpperCase());
      // }
      return result;
    } catch (error) {
      console.log(`! i18n text ${error}`);
      return expr;
    }
  }

  private _i18nCase(result: string, format: string): string {
    result = result.replace(/\s\s+/g, ' ');

    // Transform a string into title case.
    // - 'follow step-by-step instructions': "Follow Step-by-step Instructions"
    if (format === 'title') {
      const words: any = result.toLowerCase().split(' ');
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
      }
      return words.join(' ');
    }

    // Upper Case
    // - 'this is a simple sentence': 'THIS IS A SIMPLE SENTENCE'
    if (format === 'upper') {
      return result.toUpperCase();
    }

    // Lower Case
    // - 'THIS IS A SIMPLE SENTENCE': 'this is a simple sentence'
    if (format === 'lower') {
      return result.toLowerCase();
    }

    // Dot Case
    // - 'This is a simple sentence': 'this.is.a.simple.sentence'
    if (format === 'dot') {
      return result
        .split(' ')
        .reduce((a: any, v: any) => a.concat(v.toLowerCase()), [])
        .join('.');
    }

    // Snake Case
    // - 'This is a simple sentence': 'this_is_a_simple_sentence'
    if (format === 'snake') {
      return result
        .split(' ')
        .reduce((a: any, v: any) => a.concat(v.toLowerCase()), [])
        .join('_');
    }

    // Path Case
    // - 'This is a simple sentence': 'this/is/a/simple/sentence'
    if (format === 'path') {
      return result
        .split(' ')
        .reduce((a: any, v: any) => a.concat(v.toLowerCase()), [])
        .join('/');
    }

    // Param Case
    // - 'This is a simple sentence': 'this-is-a-simple-sentence'
    if (format === 'param') {
      return result
        .split(' ')
        .reduce((a: any, v: any) => a.concat(v.toLowerCase()), [])
        .join('-');
    }

    // Return result
    return result;
  }

  private _i18nMask(result: string, format: string): string {
    format = format.replace(/{YYYY}/, '0000');
    format = format.replace(/{MM}/, '00');
    format = format.replace(/{DD}/, '00');
    format = format.replace(/{hh}/, '00');
    format = format.replace(/{mm}/, '00');
    format = format.replace(/{ss}/, '00');
    format = format.replace(/{ms}/, '000');

    // Format result
    let i = 0;
    result = result.replace(/[^0-9]/g, '').trim();
    result = format.replace(/./g, (m: any) => (m === '0' ? result[i++] || '' : result[i] ? m : ''));
    return result;
  }

  private _i18nDate(result: string, input: string, match: string): string {
    match = match.replace(/{YYYY}/, '(?<YYYY>[0-9]{4})?');
    match = match.replace(/{MM}/, '(?<MM>[0-9]{2})?');
    match = match.replace(/{DD}/, '(?<DD>[0-9]{2})?');
    match = match.replace(/{hh}/, '(?<hh>[0-9]{2})?');
    match = match.replace(/{mm}/, '(?<mm>[0-9]{2})?');
    match = match.replace(/{ss}/, '(?<ss>[0-9]{2})?');
    match = match.replace(/{ms}/, '(?<ms>[0-9]{3})?');
    match = match.replace(/{TZ}/, '(?<TZ>Z)?');
    match = match + '(.*?)?$';

    input = input.replace(/{YYYY}/, '$<YYYY>');
    input = input.replace(/{MM}/, '$<MM>');
    input = input.replace(/{DD}/, '$<DD>');
    input = input.replace(/{hh}/, '$<hh>');
    input = input.replace(/{mm}/, '$<mm>');
    input = input.replace(/{ss}/, '$<ss>');
    input = input.replace(/{ms}/, '$<ms>');
    input = input.replace(/{TZ}/, '$<TZ>');

    result = result.replace(new RegExp(match), input);
    return result;
  }

  /**
   * Http QS Object to String
   */
  private _httpQsObject(params: any, prefix: any = ''): any {
    const result: any = [];
    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        const k = prefix ? prefix + '[' + p + ']' : p;
        const v = params[p];
        if (v !== null && v !== false && v !== undefined) {
          result.push(typeof v === 'object' ? this._httpQsObject(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
      }
    }
    return result.filter((v: any) => !!v).join('&');
  }

  /*********************************************************************************************************************
   *** Menu Methods
   ********************************************************************************************************************/

  /**
   * Menu Toggle
   */
  private async _menuToggle(show: any = undefined): Promise<any> {
    if (typeof show === 'undefined') {
      show = !(await this._menuIsOpen());
    }
    document.body.classList.toggle('flb-menu-hide', show === false);
    document.body.classList.toggle('flb-menu-show', show);
    this.info.setItem('menu-hide', show === true ? '0' : '1');

    if (show && !(await this._ionMenu.isOpen())) {
      this._ionMenu.toggle();
    }
  }

  /**
   * Menu Is Open
   */
  private async _menuIsOpen(): Promise<boolean> {
    return this.info.getItem('menu-hide') !== '1' ? true : false;
  }

  /**
   * Menu Values
   */
  private async _menuValues(): Promise<any> {
    this.menu.values.head = [];
    this.menu.values.main = [];
    this.menu.values.user = [];

    // Define menu values from views
    this.menu.values.head.push({
      onSetup: (item: any) => {
        item.title = this.menu.config.title;
        item.label = this.menu.config.label;
        item.image = this.menu.config.image;
        item.class = 'flb-item-type-header';
      }
    });


    for (const p of this._config.menu.items) {
      if (p.type && p.auth?.includes(this.user.access.auth || 'anonymous')) {
        const item: any = {name: p.name, path: p.path, type: p.type};
        item.onSetup = async (item: any): Promise<any> => {
          item.title = item.title || this.i18n.text(`${item.name}.menu.$content-title`) || item.name;
          item.label = item.label || this.i18n.text(`${item.name}.menu.$content-label`);
          item.image = item.image || this.i18n.text(`${item.name}.menu.$picture-image`);
          item.class = item.type === 'user' ? 'flb-item-type-button button circle' : 'flb-item-type-button button';
          item.path = item.path;
        };
        item.onClick = async (item: any): Promise<any> => {
          await this.user.goto(item.path);
          await item.onSetup(item);
        };
        this.menu.values[`${item.type}`] = this.menu.values[`${item.type}`] || [];
        this.menu.values[`${item.type}`].push(item);
      }
    }

    this.menu.values.user.push({
      onSetup: async (item: any) => {
        const o: any = (await this.menu.isOpen()) ? 'show' : 'hide';
        item.title = this.i18n.text(`flip.menu.toggle.$title.$${o}`);
        item.label = this.i18n.text(`flip.menu.toggle.$label.$${o}`);
        item.image = this.i18n.text(`flip.menu.toggle.$image.$${o}`);
        item.class = 'flb-item-type-button button circle ion-hide-lg-down';
      },
      onClick: async (item: any) => {
        await this.menu.toggle();
        await item.onSetup(item);
      }
    });

    for (const kind of ['head', 'main', 'user']) {
      for (const item of this.menu.values[kind] || []) {
        if (item.onSetup) {
          await item.onSetup(item);
        }
      }
    }
  }

  /*********************************************************************************************************************
   *** Page Methods
   ********************************************************************************************************************/

  /**
   * Page Loading
   */
  private async _pageLoading(params: any = {}): Promise<any> {
    this._loading = null;
    this._loadingController.dismiss('loading').catch(() => true);

    const dialog: any = {};
    dialog.id = 'loading';
    dialog.message = params.display || this.i18n.text(`${params.message}.$loading-title`, params.value) || undefined;
    dialog.spinner = params.spinner || 'circles';
    dialog.duration = params.duration || 10000;
    dialog.cssClass = params.cssClass || 'flb';

    if (dialog.message) {
      (async () => {
        const loading = (this._loading = `${new Date().getTime()}-${Math.random()}`);
        await new Promise((r: any) => setTimeout(r, params.delay || 1000));
        if (loading !== this._loading) {
          return;
        }
        const object: any = await this._loadingController.create(dialog);
        await object.present();
      })();
    }
  }

  /**
   * Page Message
   */
  private async _pageMessage(params: any = {}): Promise<any> {
    this._loading = null;
    this._loadingController.dismiss('loading').catch(() => true);

    const dialog: any = {};
    dialog.id = 'message';
    dialog.message = params.display || this.i18n.text(`${params.message}.$message-title`, params.value) || undefined;
    dialog.duration = params.duration || 1500;
    dialog.cssClass = params.cssClass || 'flb';
    dialog.color = params.color || 'dark';

    if (dialog.message) {
      (async () => {
        const object: any = await this._ionToast.create(dialog);
        await object.present();
      })();
    }
  }

  /**
   * Page Success
   */
  private async _pageSuccess(params: any = {}): Promise<any> {
    this._loading = null;
    this._loadingController.dismiss('loading').catch(() => true);

    const dialog: any = {};
    dialog.id = 'success';
    dialog.message = params.display || this.i18n.text(`${params.message}.$success-title`, params.value) || undefined;
    dialog.duration = params.duration || 1500;
    dialog.cssClass = params.cssClass || 'flb';
    dialog.color = params.color || 'success';

    if (dialog.message) {
      (async () => {
        const object: any = await this._ionToast.create(dialog);
        await object.present();
      })();
    }
  }

  /**
   * Page Warning
   */
  private async _pageWarning(params: any = {}): Promise<any> {
    this._loading = null;
    this._loadingController.dismiss('loading').catch(() => true);

    if (params.error) {
      params.display = this.i18n.text(`${params.message}.$warning-error-${params.error?.status || '200'}`, params.value) || params.error.toString();
    }

    if (params.error?.status === 401) {
      console.error(`! error: ${params.error.status}`);
      await this.user.goto('user/signin', {user: false});
    }

    const dialog: any = {};
    dialog.id = 'warning';
    dialog.message = params.display || this.i18n.text(`${params.message}.$warning-title`, params.value) || `¡${dialog.id}!`;
    dialog.duration = params.duration || 2500;
    dialog.cssClass = params.cssClass || 'flb';
    dialog.color = params.color || 'warning';

    if (dialog.message) {
      (async () => {
        const object: any = await this._ionToast.create(dialog);
        await object.present();
      })();
    }
  }

  /**
   * Page Alert
   */
  private async _pageAlert(params: any = {}): Promise<any> {
    return await new Promise(async (resolve: any) => {
      const dialog: any = {};
      dialog.header = this.i18n.text(`${params.path}.header.$header.$content-title`, params.data) || undefined;
      dialog.subHeader = this.i18n.text(`${params.path}.header.$header.$content-label`, params.data) || undefined;
      dialog.message = this.i18n.text(`${params.path}.header.$header.$content-place`, params.data) || undefined;
      dialog.inputs = (params.form || []).map((i: any) => {
        i.placeholder = i.placeholder || this.i18n.text(`${params.path}.${i.name}.$${i.type}.$content-place`, params.values) || i.name;
        return i;
      });
      dialog.buttons = [];
      dialog.buttons.push({text: this.i18n.text(`${params.path}.cancel.$button.$content-title`), role: 'cancel', handler: (result: any) => resolve({cancel: true, result})});
      dialog.buttons.push({text: this.i18n.text(`${params.path}.submit.$button.$content-title`), role: 'submit', handler: (result: any) => resolve({submit: true, result})});
      dialog.cssClass = params.cssClass || 'flb' + (params.type ? ' ' + params.type : '');

      const object: any = await this._ionAlert.create(dialog);
      await object.present();
    });
  }

  /**
   * Page Modal
   */
  private async _pageModal(params: any = {}): Promise<any> {
    if (params.lock) {
      await this._ionModal.dismiss().catch(() => true);
      delete params.lock;
    }
    const modal = await this._ionModal.create({cssClass: 'flb', ...params});
    await modal.present();

    const result: any = await modal.onDidDismiss();
    if (result && result.data) {
      return result.data;
    } else {
      return null;
    }
  }

  /**
   * Page Browser Download
   */
  async _pageBrowserDownload(params: any): Promise<any> {
    const contentName = params.headers.get('content-disposition').match(/filename=("|')?(.*?)("|')?$/)[2];
    const contentType = params.headers.get('content-type');

    const element: any = document.createElement('a');
    element.style.display = 'none';
    element.href = URL.createObjectURL(params.body);
    element.type = contentType;
    element.download = contentName;
    element.click();
  }

  /**
   * Page Browser Print
   */
  async _pageBrowserPrint(params: any): Promise<any> {
    const element: any = document.createElement('iframe');
    element.style.display = 'none';
    element.src = URL.createObjectURL(params.body);
    element.onload = () => {
      element.focus();
      element.contentWindow?.print();
    };
    document.body.appendChild(element);
  }

  /**
   * Page Browser Share
   */
  async _pageBrowserShare(params: any): Promise<any> {
    const contentName = params.headers.get('content-disposition').match(/filename=("|')?(.*?)("|')?$/)[2];
    const contentType = params.headers.get('content-type');
    await navigator.share({files: [new File([params.body], contentName, {type: contentType})]});
  }

  /**
   * Page Browser Sendmail
   */
  async _pageBrowserSendmail(params: any): Promise<any> {
    console.log(params);
  }

  /**
   * Form image error event handler
   */
  async _onFormImageError($event: any): Promise<any> {
    try {
      $event.stopPropagation();
      $event.preventDefault();
      $event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mP8/58BAzAOZUEA5OUT9xiCXfgAAAAASUVORK5CYII=';
    } catch (error: any) {
      console.error(`Attention, "_onFormImageError": ${error}`);
    }
  }
}

/**
 * Google Maps
 */
declare const google: any;
declare const libphonenumber: any;

/**
 * Google Maps library
 */
export function loadTelLib(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof libphonenumber === 'object') {
      return resolve(libphonenumber);
    }
    const element: any = document.createElement('script');
    element.src = 'https://cdnjs.cloudflare.com/ajax/libs/libphonenumber-js/1.10.43/libphonenumber-js.min.js';
    //element.src = '/assets/libs/libphonenumber-js.min.js';
    element.type = 'text/javascript';
    element.addEventListener('load', () => resolve(libphonenumber));
    element.addEventListener('error', () => reject());
    document.body.append(element);
  });
}

/**
 * Google Maps library
 */
export function loadMapLib(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof google === 'object' && typeof google.maps === 'object') {
      return resolve(google.maps);
    }
    //const element: any = document.createElement('script');
    //element.src = 'https://maps.googleapis.com/maps/api/js?key=' + 'AIzaSyAHirNhGiN8ueynTCX-ki2RAI1wSRZM5no' + '&callback=Function.prototype';
    //element.type = 'text/javascript';
    //element.addEventListener('load', () => resolve(google.maps));
    //element.addEventListener('error', () => reject());
    //document.body.append(element);
    return {};
  });
}

/**
 * Geocode object
 */
export function geocodeLatLng(params: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const google: any = await loadMapLib();
    const geocoder: any = new google.maps.Geocoder();
    geocoder.geocode({location: params.object}, (value: any, status: any) => {
      if (status === 'OK' && value && value[0]) {
        //formatAddress({...value[0], keep_street: false});
        resolve({...value[0], keep_street: false});
      } else {
        reject();
      }
    });
  });
}

/**
 * Geocode string
 */
export function geocodeString(params: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    //const filter: any = {
    //  address: [formatI18n(params.street).replace(/^(.*? [0-9]+) .*?$/, '$1'), formatI18n(params.city), formatI18n(params.state), formatI18n(params.country)]
    //    .filter((v) => !!v)
    //    .join(', ')
    //    .trim()
    //};
    const google: any = await loadMapLib();
    const geocoder: any = new google.maps.Geocoder();
    geocoder.geocode({address: params.string}, (value: any, status: any) => {
      if (status === 'OK' && value && value[0]) {
        //formatAddress({...value[0], keep_street: true});
        resolve({...value[0], keep_street: true});
      } else {
        reject();
      }
    });
  });
}

/**
 * Load current position
 */
export function loadCurrentPosition(): Promise<any> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((value: any) => {
      if (value && value.coords) {
        //this.geocodeLatLng({lat: value.coords.latitude, lng: value.coords.longitude});
        resolve({lat: value.coords.latitude, lng: value.coords.longitude});
      } else {
        reject();
      }
    });
  });
}
