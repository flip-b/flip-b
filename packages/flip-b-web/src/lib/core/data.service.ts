import {Injectable, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoadingController, AlertController, ModalController, ToastController, MenuController, Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  user: any = {};
  info: any = {};

  //_history: any = [];
  _ionLoadingStatus: any = false;

  /**
   * Constructor
   */
  constructor(
    @Inject('config') public _config: any = {},
    private _httpClient: HttpClient,
    private _ionLoading: LoadingController,
    private _ionMenu: MenuController,
    private _ionAlert: AlertController,
    private _ionModal: ModalController,
    private _ionToast: ToastController,
    private _ionPlatform: Platform,
    private _router: Router
  ) {
    // Define user laod
    // @param {Function}
    Object.defineProperty(this.user, 'load', {
      value: (user: any): any => {
        if (typeof user === 'undefined') {
          return JSON.parse(this.user.item('user') || '{}');
        } else {
          return this.user.item('user', JSON.stringify(user || {}));
        }
      },
      enumerable: false
    });

    // Define user item
    // @param {Function}
    Object.defineProperty(this.user, 'item', {
      value: (item: any, data: any): any => {
        if (typeof data === 'undefined') {
          return window.sessionStorage.getItem(`${this._config.app}-${item}`);
        } else {
          return window.sessionStorage.setItem(`${this._config.app}-${item}`, `${data || ''}`);
        }
      },
      enumerable: false
    });

    // this._ionPlatform.pause.subscribe(async () => {
    //   console.info('Pause event detected');
    // });
    // this._ionPlatform.resume.subscribe(async () => {
    //   console.info('Resume event detected');
    // });
    // this._ionPlatform.resize.subscribe(async () => {
    //   console.info('Resize event detected');
    // });
    //import {Router, NavigationEnd} from '@angular/router';
    // this._router.events.subscribe(async (event: any): Promise<any> => {
    //   if (event instanceof NavigationEnd && event.url) {
    //     this._history.push(event.urlAfterRedirects);
    //     this._history = this._history.slice(-10);
    //   }
    // });

    this.init();
  }

  /**
   * Initialize
   */
  init() {
    const user: any = this.user.load();

    Object.defineProperty(this.user, 'access', {value: {...(user.access || {})}, writable: true, enumerable: false});
    Object.defineProperty(this.user, 'config', {value: {...(user.config || {})}, writable: true, enumerable: false});
    Object.defineProperty(this.user, 'values', {value: {...(user.values || {})}, writable: true, enumerable: false});

    Object.defineProperty(this.info, 'i18n', {value: {}, writable: true, enumerable: false});
    Object.defineProperty(this.info.i18n, 'config', {value: {...this._config.i18n.config}, writable: true, enumerable: false});
    Object.defineProperty(this.info.i18n, 'values', {value: {...this._config.i18n.values}, writable: true, enumerable: false});

    Object.defineProperty(this.info, 'menu', {value: {}, writable: true, enumerable: false});
    Object.defineProperty(this.info.menu, 'config', {value: {...this._config.menu.config, ...(this.user.config.menu?.config || {})}, writable: true, enumerable: false});
    Object.defineProperty(this.info.menu, 'values', {value: [...this._config.menu.values, ...(this.user.config.menu?.values || [])], writable: true, enumerable: false});

    Object.defineProperty(this.info, 'page', {value: {}, writable: true, enumerable: false});
    Object.defineProperty(this.info.page, 'config', {value: {...this._config.page.config, ...(this.user.config.page?.config || {})}, writable: true, enumerable: false});
    Object.defineProperty(this.info.page, 'values', {value: [...this._config.page.values, ...(this.user.config.page?.values || [])], writable: true, enumerable: false});

    this.pageTheme();
  }

  /**
   * Auth
   */
  auth(path: string, data: any = {}): any {
    if (typeof data.user !== 'undefined') {
      this.user.load(data.user);
      this.init();
    }
    for (const d in data) {
      path = path.replace(new RegExp(':' + d), data[d]);
    }
    for (const v of this.info.page.values) {
      if (v.path === path && (!v.auth || v.auth.includes(this.user.access?.auth || 'anonymous'))) {
        return true;
      }
    }
    return false;
  }

  /**
   * Goto
   */
  goto(path: string, data: any = {}): any {
    if (typeof data.user !== 'undefined') {
      this.user.load(data.user);
      this.init();
    }
    for (const d in data) {
      path = path.replace(new RegExp(':' + d), data[d]);
    }
    for (const v of this.info.page.values) {
      if (v.path === path && (!v.auth || v.auth.includes(this.user.access?.auth || 'anonymous'))) {
        return this._router.navigate([path], {replaceUrl: true, state: data});
      }
    }
    return false;
  }

  /**
   * Http
   */
  http(params: any): any {
    if (params.search) {
      params.method = 'GET';
      params.url = `${this._config.url || ''}`;
      params.uri = `${this._config.uri || ''}/${params.search}`;
    } else if (params.select) {
      params.method = 'GET';
      params.url = `${this._config.url || ''}`;
      params.uri = `${this._config.uri || ''}/${params.select}/:index`;
    } else if (params.create) {
      params.method = 'POST';
      params.url = `${this._config.url || ''}`;
      params.uri = `${this._config.uri || ''}/${params.create}`;
    } else if (params.update) {
      params.method = 'PUT';
      params.url = `${this._config.url || ''}`;
      params.uri = `${this._config.uri || ''}/${params.update}/:index`;
    } else if (params.delete) {
      params.method = 'DELETE';
      params.url = `${this._config.url || ''}`;
      params.uri = `${this._config.uri || ''}/${params.delete}/:index`;
    } else if (params.lookup) {
      params.method = 'POST';
      params.url = `${this._config.url || ''}`;
      params.uri = `${this._config.uri || ''}/${params.lookup}/lookup/:index`;
    } else if (params.upload) {
      params.method = 'POST';
      params.url = `${this._config.url || ''}`;
      params.uri = `${this._config.uri || ''}/${params.upload}/upload/:index`;
    } else if (params.submit) {
      params.method = 'POST';
      params.url = `${this._config.url || ''}`;
      params.uri = `${this._config.uri || ''}/${params.submit}`;
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

    params.headers = {...(this._config.headers || {}), ...(this.user.config.http?.config?.headers || {}), ...(params.headers || {})};
    for (const h in params.headers) {
      if (!params.headers[h]) {
        delete params.headers[h];
      }
    }

    const method: any = `${params.method || 'GET'}`.toUpperCase().trim();
    const url: any = `${params.url || ''}`.trim();
    const uri: any = `${params.uri || ''}`.trim();
    const qs: any = params.qs ? '?' + this._httpQsObject(params.qs) : '';
    const body: any = params.form || params.body;
    const headers: any = new HttpHeaders(params.headers);
    const observe: any = params.observe || undefined;
    const responseType: any = params.type || undefined;

    //console.log(`${url}${uri}${qs}`)
    return this._httpClient.request(method, `${url}${uri}${qs}`, {body, headers, observe, responseType}).toPromise();
  }

  /**
   * I18n
   */
  i18n(...args: any): any {
    let params: any = {};
    if (typeof args[0] === 'object') {
      params = args[0];
    }
    if (typeof args[1] === 'string') {
      params = {value: args[0], type: args[1]};
    }

    const config: any = this.info.i18n.config || {};
    const format: any = this.info.i18n.config.format || {};
    const result: any = {};
    result.event = params.event?.type;
    result.input = undefined;
    result.value = undefined;
    result.valid = true;
    result.parse = undefined;

    if (typeof args[0] === 'string' && args[0].match(/\$[a-z-]+$/)) {
      result.parse = 'translate';
    } else if (['address'].includes(params.type)) {
      result.parse = 'address';
    } else if (['select'].includes(params.type)) {
      result.parse = 'select';
    } else if (['switch', 'toggle'].includes(params.type)) {
      result.parse = 'bool';
    } else if (['date', 'datetime', 'time', 'year', 'year-month'].includes(params.type)) {
      result.parse = 'date';
    } else if (['integer', 'decimal', 'currency', 'percent', 'quantity'].includes(params.type)) {
      result.parse = 'number';
    } else {
      result.parse = 'string';
    }

    if (!result.parse) {
    } else if (result.parse === 'address') {
      /*
       * Address Parse
       *
       *
       *
       *
       */

      // Define value
      if (result.event === 'input') {
        result.value = params.value || {};
      } else {
        result.value = params.value || {};
      }

      if (typeof result.value === 'string') {
        result.value = {};
      }
      if (typeof result.value === 'object') {
        result.input = [result.value.street, result.value.portal, result.value.city, result.value.state, result.value.country, result.value.zipcode].filter((v) => !!v).join(', ');
      }

      //!Object.keys(result.value || {}).length)
      console.log('address', params, result);
    } else if (result.parse === 'select') {
      /*
       * Select Parse
       *
       *
       *
       *
       */

      // Define value
      if (params.data?.items?.length) {
        console.log('select 1', params.$ctrl?.currentValue, params.$ctrl?.currentInput);

        const match: any = params.data.items.find((v: any) => JSON.stringify({_: v.value}) === JSON.stringify({_: params.value}));
        result.value = match?.value;
        result.input = match?.title;

      } else if (typeof params.value === 'string') {
        console.log('select a', params.$ctrl?.currentValue, params.$ctrl?.currentInput);

        result.value = params.value;
        result.input = params.input;

      } else if (typeof params.value === 'object' && params.value.index) {
        console.log('select b', params.$ctrl?.currentValue, params.$ctrl?.currentInput);

        result.value = params.value.index;
        result.input = params.value.title;

      } else if (typeof params.value === 'object' && params.value._id) {
        console.log('select c', params.$ctrl?.currentValue, params.$ctrl?.currentInput);

        result.value = params.value._id;
        result.input = params.value.name;
      } else {
        console.log('select d', params.$ctrl?.currentValue, params.$ctrl?.currentInput);

        const match: any = (params.data.items || []).find((v: any) => JSON.stringify({_: v.value}) === JSON.stringify({_: params.value?.value}));
        result.value = match?.value;
        result.input = match?.title;
      }
    } else if (result.parse === 'bool') {
      /*
       * Bool Parse
       *
       *
       *
       *
       */

      // Define value
      result.value = params.value;

      // Format value
      if (result.event === 'click' || result.event === 'input') {
        result.value = result.value ? false : true;
      } else {
        result.value = result.value ? true : false;
      }

      // Verify value
      if (params.require && !result.value) {
        result.valid = false;
      }
    } else if (result.parse === 'date') {
      /*
       * Date Parse
       *
       *
       *
       *
       */

      // Define value
      if (typeof params.value === 'object' && params.value instanceof Date) {
        params.value = params.value.toISOString();
      }
      if (result.event === 'input') {
        result.value = `${params.input || ''}`;
      } else {
        result.value = `${params.value || ''}`;
      }

      // Format value
      if (
        format[`${params.type}-locale`] &&
        result.event !== 'input' &&
        result.value &&
        result.value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}([.][0-9]{3})?(Z|[+-][0-9]{2}:[0-9]{2})$/)
      ) {
        const tz: Date = new Date(result.value);
        const lt: Date = new Date(tz.getTime() - tz.getTimezoneOffset() * 60000);
        result.value = lt.toISOString();
        result.value = this._i18nDate(result.value, format[`${params.type}-locale`], '{YYYY}-{MM}-{DD}T{hh}:{mm}:{ss}.{ms}{TZ}');
      }

      // Format value
      if (format[`${params.type}-locale`] && result.event !== 'input' && result.value) {
        result.value = this._i18nDate(result.value, format[`${params.type}-locale`], format[`${params.type}-format`]);
        result.input = this._i18nDate(result.value, format[`${params.type}-format`], format[`${params.type}-locale`]);
      }

      // Define input
      if (format[`${params.type}-format`] && result.event === 'input' && result.value) {
        result.input = this._i18nMask(result.value, format[`${params.type}-format`]);
      }

      // Verify value
      if (params.require && !result.value) {
        result.valid = false;
      }
    } else if (result.parse === 'number') {
      /*
       * Number Parse
       *
       *
       *
       *
       */

      // Define value
      if (result.event === 'input') {
        result.value = `${params.input || '0'}`;
        result.value = result.value.replace(/[^0-9-., ]/g, '');
        result.value = result.value.replace(/[^0-9-]/g, '.');
        result.value = result.value.replace(/\.\.+/g, '.');
        result.value = result.value.replace(/\-\-+/g, '-');
        result.value = result.value.replace(/\.([0-9]+)\./g, '$1.');
        result.value = result.value.replace(/(.)-/g, '$1');
        result.value = result.value.replace(/^0+/g, '');
        result.value = result.value.substring(0, 16);
      } else {
        result.value = `${params.value || '0'}`;
      }

      // Format value
      if (result.value && !Number.isNaN(Number(result.value))) {
        result.value = Math.round((Number(result.value) + Number.EPSILON) * 100) / 100;
      } else {
        result.value = 0;
      }
      if (params.max && params.max < result.value) {
        result.value = params.max;
      }
      if (params.min && params.min > result.value) {
        result.value = params.min;
      }
      if (params.type === 'integer') {
        result.value = Math.round(result.value);
      }

      // Define input on enter
      if (result.event === 'enter') {
        result.input = `${result.value}`;
        result.input = result.input.replace(/[^0-9-.]/g, '');
        result.input = result.input.replace(/^0+/g, '');
      }

      // Define input on setup
      if (!result.event || result.event === 'setup' || result.event === 'leave') {
        const parts: any = `${result.value}`.split('.');
        const parti = `${parts[0] || '0'}`.replace(new RegExp('\\B(?=(\\d{' + format['integer-digits'] + '})+(?!\\d))', 'g'), '{IS}');
        const partd = `${parts[1] || '0'}000000000000000`.substring(0, parseInt(format['decimal-digits']));

        result.input = format[`${params.type}-format`];
        result.input = result.input.replace(/{SN}/g, result.value < 0 ? format['negative-symbol'] : '');
        result.input = result.input.replace(/{SP}/g, result.value > 0 ? format['positive-symbol'] : '');
        result.input = result.input.replace(/{IV}/g, parti);
        result.input = result.input.replace(/{DV}/g, partd);
        result.input = result.input.replace(/{IS}/g, format['integer-symbol']);
        result.input = result.input.replace(/{DS}/g, format['decimal-symbol']);
        result.input = result.input.replace(/{PS}/g, format['percent-symbol']);
        result.input = result.input.replace(/{CS}/g, format['currency-symbol']);
        result.input = result.input.replace(/{QS}/g, format['quantity-symbol']);
        result.input = result.input.replace(/\s\s+/g, ' ');
        result.input = result.input.trim();
      }

      // Verify value
      if (params.require && !result.value) {
        result.valid = false;
      }
    } else if (result.parse === 'string') {
      /*
       * String Parse
       *
       *
       *
       *
       */

      // Define value
      if (result.event === 'input') {
        result.value = `${params.input || ''}`;
      } else {
        result.value = `${params.value || ''}`;
      }

      // Format value
      if (params.type === 'id') {
        result.value = result.value.trim();
      } else if (params.type === 'phone') {
        result.value = result.value.replace(/[^0-9]/g, '');
      } else if (params.type === 'email') {
        result.value = result.value.toLowerCase().replace(/\s/g, '');
      } else if (params.type === 'color') {
        result.value = result.value.toLowerCase().replace(/\s/g, '');
      } else if (params.type === 'username') {
        result.value = result.value.toLowerCase().replace(/\s/g, '');
      } else if (params.type === 'password') {
        result.value = result.value.trim();
      } else {
        result.value = result.value.replace(/\s\s+/g, ' ').trim();
      }

      // Format value
      if (params.type === 'phone' && result.value && (!result.event || result.event === 'setup' || result.event === 'leave')) {
        try {
          const phone: any = window.libs.libphonenumber.parsePhoneNumber(result.value, config.region);
          result.value = phone && phone.isValid() ? phone.format('INTERNATIONAL') : result.value;
          result.valid = phone && phone.isValid();
        } catch (error) {
          result.valid = false;
        }
      }

      if (params.type === 'email' && result.value && (!result.event || result.event === 'setup' || result.event === 'leave')) {
        //result.valid = result.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      }

      // Format "title" case
      // - 'follow step-by-step instructions': "Follow Step-by-step Instructions"
      if (params.case === 'title') {
        const words: any = result.value.toLowerCase().split(' ');
        for (let i = 0; i < words.length; i++) {
          words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
        }
        result.value = words.join(' ');
      }

      // Format "upper" case
      // - 'this is a simple sentence': 'THIS IS A SIMPLE SENTENCE'
      if (params.case === 'upper') {
        result.value = result.value
          .split(' ')
          .reduce((a: any, v: any) => a.concat(v.toUpperCase()), [])
          .join(' ');
      }

      // Format "lower" case
      // - 'THIS IS A SIMPLE SENTENCE': 'this is a simple sentence'
      if (params.case === 'lower') {
        result.value = result.value
          .split(' ')
          .reduce((a: any, v: any) => a.concat(v.toLowerCase()), [])
          .join(' ');
      }

      // Format "dot" case
      // - 'This is a simple sentence': 'this.is.a.simple.sentence'
      if (params.case === 'dot') {
        result.value = result.value
          .split(' ')
          .reduce((a: any, v: any) => a.concat(v.toLowerCase()), [])
          .join('.');
      }

      // Format "snake" case
      // - 'This is a simple sentence': 'this_is_a_simple_sentence'
      if (params.case === 'snake') {
        result.value = result.value
          .split(' ')
          .reduce((a: any, v: any) => a.concat(v.toLowerCase()), [])
          .join('_');
      }

      // Format "path" case
      // - 'This is a simple sentence': 'this/is/a/simple/sentence'
      if (params.case === 'path') {
        result.value = result.value
          .split(' ')
          .reduce((a: any, v: any) => a.concat(v.toLowerCase()), [])
          .join('/');
      }

      // Format "param" case
      // - 'This is a simple sentence': 'this-is-a-simple-sentence'
      if (params.case === 'param') {
        result.value = result.value
          .split(' ')
          .reduce((a: any, v: any) => a.concat(v.toLowerCase()), [])
          .join('-');
      }

      // Verify size
      if (params.max && params.max < result.value.length) {
        result.value = result.value.substring(0, params.max);
      }

      // Define mask
      if (params.mask) {
        result.value = this._i18nMask(result.value, params.mask);
      }

      // Verify value
      if (params.require && !result.value) {
        result.valid = false;
      } else if (params.pattern && result.value.match(params.pattern)) {
        result.valid = false;
      } else if (params.min && params.min > result.value.length) {
        result.valid = false;
      } else if (params.max && params.max < result.value.length) {
        result.valid = false;
      }
    } else if (result.parse === 'translate') {
      /*
       * Translate Parse
       *
       *
       *
       *
       */

      // Define part
      // [formName].[formType].[itemName].[itemType].[dataType]
      const parts: string[] = `${args[0] || ''}`.split('.');

      // Define data type
      let dataType = '';
      if (parts[0].match(/^[a-z].+$/)) {
        dataType = parts.pop() || '';
      }

      // Define form name
      let formName = '';
      if (parts[0].match(/^[a-z].+$/)) {
        formName = parts.shift() || '';
      }

      // Define form type
      let formType = '';
      if (parts[0]?.match(/^\$[a-z].+$/)) {
        formType = parts.shift() || '';
      }

      // Define item name
      let itemName = '';
      while (parts[0]?.match(/^[a-z].+$/)) {
        itemName = (itemName ? itemName + '.' : '') + (parts.shift() || '');
      }

      // Define item type
      let itemType = '';
      if (parts[0]?.match(/^\$[a-z].+$/)) {
        itemType = parts.shift() || '';
      }

      // Define find
      const find: any = [];
      if (formType && itemName && itemType && dataType) {
        find.push(`${formType}.${itemName}.${itemType}.${dataType}`);
      }
      if (itemName && itemType && dataType) {
        find.push(`${itemName}.${itemType}.${dataType}`);
      }
      if (itemName && dataType) {
        find.push(`${itemName}.${dataType}`);
      }
      if (itemType && dataType) {
        find.push(`${itemType}.${dataType}`);
      }

      // Define data
      let data: any = '';
      for (const x of [formName, '$page']) {
        for (const y of find) {
          if (typeof this.info.i18n.values[x] !== 'undefined' && typeof this.info.i18n.values[x][y] !== 'undefined') {
            data = this.info.i18n.values[x][y];
            break;
          }
        }
        if (data) {
          break;
        }
      }
      if (typeof data !== 'string') {
        return data;
      }
      data = data.replace(/\s\s+/g, ' ').trim();

      //  const plain: any = this.getObjectFlat(params);
      //  for (const i in plain) {
      //    data = data.replace(`{{${i}}}`, plain[i]);
      //  }
      const replacements: any = [...(data.matchAll(/\{\{(.*?)\}\}/g) || [])];
      for (const r of replacements) {
        if (r[0] === '{{page.config.$title}}') {
          data = data.replace(r[0], this.info.page.config.title);
          continue;
        }
        if (r[0] === '{{page.config.$image}}') {
          data = data.replace(r[0], this.info.page.config.image);
          continue;
        }
        data = data.replace(r[0], this.i18n(formName + '.' + formType + '.' + r[1]));
      }
      data = data.replace(/\{\{.*?\}\}/g, '').trim();
      data = data.replace(/\s\s+/g, ' ').trim();
      return data;
    }

    // Verify input
    if (typeof result.input === 'undefined' && typeof result.value !== 'undefined') {
      result.input = result.value;
    }

    // Return result
    return result.event ? result : result.input;
  }

  /**
   * Send Download
   */
  async sendDownload(params: any): Promise<any> {
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
   * Send Print
   */
  async sendPrint(params: any): Promise<any> {
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
   * Send Share
   */
  async sendShare(params: any): Promise<any> {
    const contentName = params.headers.get('content-disposition').match(/filename=("|')?(.*?)("|')?$/)[2];
    const contentType = params.headers.get('content-type');
    await navigator.share({files: [new File([params.body], contentName, {type: contentType})]});
  }

  /**
   * Show Context Menu
   */
  async showContextMenu(open: any): Promise<any> {
    const show: any = this.user.item('menu') !== 'hide';
    this.user.item('menu', show && open !== true ? 'hide' : 'show');
    this.menuIsOpen();
    this._ionMenu.toggle();
  }

  /**
   * Show Loading
   */
  async showLoading(params: any = {}): Promise<any> {
    this._ionLoadingStatus = false;
    this._ionLoading.dismiss('loading').catch(() => true);

    const dialog: any = {};
    dialog.id = 'loading';
    dialog.message = params.display || this.i18n(`${params.message}.$loading-title`, params.value) || undefined;
    dialog.spinner = params.spinner || 'circles';
    dialog.duration = params.duration || 10000;
    dialog.cssClass = params.cssClass || 'flb';
    if (!dialog.message) {
      return;
    }

    (async () => {
      const loading = (this._ionLoadingStatus = `${new Date().getTime()}-${Math.random()}`);
      await new Promise((r: any) => setTimeout(r, params.delay || 1000));
      if (loading === this._ionLoadingStatus) {
        const object: any = await this._ionLoading.create(dialog);
        await object.present();
      }
    })();
  }

  /**
   * Show Message
   */
  async showMessage(params: any = {}): Promise<any> {
    this._ionLoadingStatus = false;
    this._ionLoading.dismiss('loading').catch(() => true);

    const dialog: any = {};
    dialog.id = 'message';
    dialog.message = params.display || this.i18n(`${params.message}.$message-title`, params.value) || undefined;
    dialog.duration = params.duration || 1500;
    dialog.cssClass = params.cssClass || 'flb';
    dialog.color = params.color || 'dark';
    if (!dialog.message) {
      return;
    }

    const object: any = await this._ionToast.create(dialog);
    await object.present();

    const result: any = await object.onDidDismiss();
    return result;
  }

  /**
   * Show Success
   */
  async showSuccess(params: any = {}): Promise<any> {
    this._ionLoadingStatus = false;
    this._ionLoading.dismiss('loading').catch(() => true);

    const dialog: any = {};
    dialog.id = 'success';
    dialog.message = params.display || this.i18n(`${params.message}.$success-title`, params.value) || undefined;
    dialog.duration = params.duration || 1500;
    dialog.cssClass = params.cssClass || 'flb';
    dialog.color = params.color || 'success';
    if (!dialog.message) {
      return;
    }

    const object: any = await this._ionToast.create(dialog);
    await object.present();

    const result: any = await object.onDidDismiss();
    return result;
  }

  /**
   * Show Warning
   */
  async showWarning(params: any = {}): Promise<any> {
    this._ionLoadingStatus = false;
    this._ionLoading.dismiss('loading').catch(() => true);

    if (params.error) {
      console.log(params.error);
      params.display = this.i18n(`${params.message}.$warning-error-${params.error?.status || '200'}`, params.value) || params.error.toString();
    }
    //if (params.error?.status === 401) {
    //  console.error(`! error: ${params.error.status}`);
    //  await this.goto('user/signin', {user: false});
    //}

    const dialog: any = {};
    dialog.id = 'warning';
    dialog.message = params.display || this.i18n(`${params.message}.$warning-title`, params.value) || `¡${dialog.id}!`;
    dialog.duration = params.duration || 2500;
    dialog.cssClass = params.cssClass || 'flb';
    dialog.color = params.color || 'warning';
    if (!dialog.message) {
      return;
    }

    const object: any = await this._ionToast.create(dialog);
    await object.present();

    const result: any = await object.onDidDismiss();
    return result;
  }

  /**
   * Show Prompt
   */
  async showPrompt(params: any = {}): Promise<any> {
    this._ionLoadingStatus = false;
    this._ionLoading.dismiss('loading').catch(() => true);

    const dialog: any = {};
    dialog.header = this.i18n(`${params.path}.header.$header.$title`, params.data) || undefined;
    dialog.message = this.i18n(`${params.path}.header.$header.$place`, params.data) || undefined;
    dialog.inputs = (params.form || []).map((i: any) => {
      i.placeholder = i.placeholder || this.i18n(`${params.path}.${i.name}.$${i.type}.$place`, params.values) || i.name;
      return i;
    });
    dialog.buttons = [];
    dialog.buttons.push({text: this.i18n(`${params.path}.cancel.$button.$title`), role: 'cancel'});
    dialog.buttons.push({text: this.i18n(`${params.path}.submit.$button.$title`), role: 'submit'});
    dialog.cssClass = params.cssClass || 'flb' + (params.type ? ' ' + params.type : '');
    if (!dialog.message) {
      return;
    }

    const object: any = await this._ionAlert.create(dialog);
    await object.present();

    const result: any = await object.onDidDismiss();
    return result;
  }

  /**
   * Show Window
   */
  async showWindow(params: any = {}): Promise<any> {
    this._ionLoadingStatus = false;
    this._ionLoading.dismiss('loading').catch(() => true);

    const object: any = await this._ionModal.create({cssClass: 'flb', ...params});
    await object.present();

    const result: any = await object.onDidDismiss();
    return result;
  }

  /*********************************************************************************************************************
   *** Support Methods
   ********************************************************************************************************************/

  /**
   * Form image error event handler
   */
  async _onFormImageError($event: any): Promise<any> {
    try {
      $event.stopPropagation();
      $event.preventDefault();
      $event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mP8/58BAzAOZUEA5OUT9xiCXfgAAAAASUVORK5CYII=';
      $event.target.error = null;
    } catch (error: any) {
      console.error(`Attention, "_onFormImageError": ${error}`);
    }
  }

  /*********************************************************************************************************************
   *** Support Methods
   ********************************************************************************************************************/

  /**
   * Get Router Snap
   */
  getRouterSnap(): any {
    return this._router.routerState.snapshot.root.firstChild;
  }

  /**
   * Get Object Copy
   */
  getObjectCopy(value: any = {}): any {
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
      clone[k] = this.getObjectCopy(clone[k]);
    }
    return clone;
  }

  /**
   * Get Object Flat
   */
  getObjectFlat(value: any = {}, prefix = '', result: any = {}): any {
    if (typeof value !== 'object' || value === null || value instanceof RegExp) {
      return value;
    }
    for (const i in value) {
      if (typeof value[i] === 'object') {
        this.getObjectFlat(value[i], `${prefix}${i}.`, result);
      } else {
        result[`${prefix}${i}`] = value[i];
      }
    }
    return result;
  }

  /**
   * Get Object Slot
   */
  getObjectSlot(items: any, frm = '', str = '', fresh: any = {}, path = ''): any {
    //if (!items.length) {
    //  items.push({name: 'title', type: 'text', slot: 'title'});
    //  items.push({name: 'label', type: 'text', slot: 'label'});
    //  items.push({name: 'image', type: 'image', slot: 'image'});
    //}
    for (const item of items) {
      if (item.type === 'array') {
        this.getObjectSlot(item.items || [], frm, `${str}${item.name}.0.`, fresh, `${str}${item.name}.`);
      } else if (item.type === 'group') {
        this.getObjectSlot(item.items || [], frm, `${str}${item.name}.`, fresh, `${str}${item.name}.`);
      } else if (item.type === 'select') {
        item.items = item.items || [
          {name: '_id', type: 'id'},
          {name: 'name', type: 'text', slot: item.slot || 'label'}
        ];
        this.getObjectSlot(item.items, frm, `${str}${item.name}.`, fresh, `${str}${item.name}.`);
      } else if (item.slot) {
        fresh[item.slot] = fresh[item.slot] || [];
        fresh[item.slot].push({
          path: `${str}${item.name}`,
          name: `${path}${item.name}`,
          type: item.type,
          title: this.i18n(`${frm}.${path}${item.name}.$title`),
          value: true
        });
      }
    }
    return fresh;
  }

  /**
   * Set Object Slot
   */
  setObjectSlot(slot: any, value: any = {}): any {
    const object: any = this.getObjectFlat(value);
    const result: any = {};
    result.index = value.index || value._id || value.id || JSON.stringify({_: value});
    result.title = value.title || value.name;
    result.label = value.label;
    result.notes = value.notes;
    result.image = value.image;
    result.color = value.color || 'transparent';
    result.value = value;

    if (slot.title) {
      const title: any = [];
      for (const item of slot.title || []) {
        const value: any = this.i18n({type: item.type, value: object[item.path]});
        if (value) {
          title.push(value);
        }
      }
      result.title = title.join(', ');
    }
    if (slot.label) {
      const label: any = [];
      for (const item of slot.label || []) {
        const value: any = this.i18n({type: item.type, value: object[item.path]});
        if (value && item.title && item.value) {
          label.push(`<span class="label"><span class="title">${item.title}: </span><span class="value">${value}</span></span>`);
        }
      }
      result.label = label.join(', ');
    }
    if (slot.notes) {
      const notes: any = [];
      for (const item of slot.notes || []) {
        const value: any = this.i18n({type: item.type, value: object[item.path]});
        if (value && item.title && item.value) {
          notes.push(`<span class="notes"><span class="title">${item.title}: </span><span class="value">${value}</span></span>`);
        }
      }
      result.notes = notes.join(', ');
    }
    if (slot.image) {
      const image: any = [];
      for (const item of slot.image || []) {
        const value: any = this.i18n({type: item.type, value: object[item.path]});
        if (value) {
          image.push(value);
        }
      }
      result.image = image.shift();
    }
    if (slot.color) {
      const color: any = [];
      for (const item of slot.color || []) {
        const value: any = this.i18n({type: item.type, value: object[item.path]});
        if (value) {
          color.push(value);
        }
      }
      result.color = color.shift();
    }
    return result;
  }

  /*********************************************************************************************************************
   *** Support Methods
   ********************************************************************************************************************/

  private _i18nMask(result: string, format: string): string {
    format = format.replace(/{YYYY}/, '0000');
    format = format.replace(/{MM}/, '00');
    format = format.replace(/{DD}/, '00');
    format = format.replace(/{hh}/, '00');
    format = format.replace(/{mm}/, '00');
    format = format.replace(/{ss}/, '00');
    format = format.replace(/{ms}/, '000');
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

  /**
   * Menu Is Open
   */
  menuIsOpen(): any {
    const show: any = this.user.item('menu') !== 'hide';
    document.body.classList.toggle('flb-menu-hide', show === false);
    document.body.classList.toggle('flb-menu-show', show);
    return show;
  }

  pageTheme(params: any = undefined): any {
    for (const item of this.info.menu.values) {
      item.info = item.info || {};
      item.info.title = item.info.title || this.i18n(`${item.name}.menu.$title`) || item.name;
      item.info.label = item.info.label || this.i18n(`${item.name}.menu.$label`) || '';
      item.info.image = item.info.image || this.i18n(`${item.name}.menu.$image`) || '';
      item.info.class = item.info.class || this.i18n(`${item.name}.menu.$content-class`) || '';
      item.info.class = `${item.info.class} flb-item-type-${item.type} flb-item-name-${item.name}`.trim();
      if (typeof item.onClick === 'string') {
        item.onClick = new Function('{data, item}', `return (${item.onClick});`);
      }
      if (item.path && !item.onClick) {
        item.onClick = ({item}: any) => this.goto(item.path);
      }
    }

    // Define menu classes
    if (!params) {
      if (this.user.access.auth) {
        this.info.menu.enable = true;
        document.body.classList.toggle('flb-anon', false);
        document.body.classList.toggle('flb-user', true);

        this.menuIsOpen();

        params = this.info.page.config.theme || {color: 'auto'};
      } else {
        this.info.menu.enable = false;
        document.body.classList.toggle('flb-anon', true);
        document.body.classList.toggle('flb-user', false);
        params = {color: 'auto', night: true, image: 'url("https://picsum.photos/1280/720")'};
      }
    }

    let {night, color, image}: any = params;

    if (!color || color === 'auto') {
      //const match: any = window.matchMedia('(prefers-color-scheme: dark)');
      //match.addListener((media: any) => changeTheme({color: 'auto'}));
      //night = match?.matches ? true : false;
      image = image || false;
      night = night || false;
      color = night ? '#121212' : '#ffffff';
    }

    document.body.classList.toggle('flb-theme', true);
    document.body.classList.toggle('flb-theme-light', night ? false : true);
    document.body.classList.toggle('flb-theme-night', night ? true : false);

    document.body.style.setProperty('--flb-background-image', `${image || ''}`);
    document.body.style.setProperty('--flb-background-color', `${color || ''}`);

    const match: any = `${color || ''}`.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

    document.body.style.setProperty('--flb-background-color-rgb', match ? `${parseInt(match[1], 16)},${parseInt(match[2], 16)},${parseInt(match[3], 16)}` : '');

    if (this.info.page.config.title) {
      const $title: any = document.querySelector('title');
      if ($title) {
        $title.innerText = this.info.page.config.title;
      }
    }
    if (this.info.page.config.color) {
      const $color: any = document.querySelector('meta[name=theme-color]');
      if ($color) {
        $color.setAttribute('content', this.info.page.config.color);
      }
    }
    if (this.info.page.config.image) {
      const $icons: any = document.querySelectorAll('link[rel=icon]');
      if ($icons) {
        [...$icons].map(($icon: any) => $icon.setAttribute('href', this.info.page.config.image));
      }
    }
  }
}
