import {Injectable, Inject} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {HttpService} from './http.service';
import {LoadingController, AlertController, ModalController, ToastController, MenuController, Platform} from '@ionic/angular';
import {events} from './data.events';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Definitions

  /**
   * Menu
   */
  menu: any;

  /**
   * Page
   */
  page: any;

  /**
   * User
   */
  user: any;

  /**
   * I18n
   */
  i18n: any;

  /**
   * History
   */
  private _history: any = [];

  /**
   * Loading
   */
  private _loading: any = false;

  /**
   * Storage
   */
  private _storage: any = localStorage || sessionStorage || {};

  /**
   * Default events
   */
  events: any = events;

  /**
   * Constructor
   */
  constructor(
    @Inject('config') public _config: any = {},
    public http: HttpService,
    public _ionAlert: AlertController,
    public _loadingController: LoadingController,
    public _ionMenu: MenuController,
    public _ionModal: ModalController,
    public _ionToast: ToastController,
    public _platform: Platform,
    public _router: Router
  ) {

    // Fix ionic popover
    setInterval(() => {
      const $elements: any = document.querySelectorAll('ion-popover');
      [...($elements || [])].map(($element: any) => {
        if ($element?.shadowRoot) {
          const $target1: any = $element.shadowRoot.querySelector('.popover-content');
          if ($target1 && $target1.style?.top !== '150px') {
            //console.log($target1.style.top); // calc(628px + var(--offset-y, 0px))
            //console.log(window.getComputedStyle($target1));
            //$target1.style.top = '150px';
          }
        }
      });
    }, 500);

    // Fix ionic popover
    setInterval(() => {
      const $elements: any = document.querySelectorAll('ion-popover ion-datetime');
      [...($elements || [])].map(($element: any) => {
        if ($element?.shadowRoot) {
          const $target1: any = $element.shadowRoot.querySelector('.calendar-month-year');
          if ($target1) {
            $target1.style.width = '150px';
          }
        }
      });
    }, 500);

    // Define router event handler
    this._router.events.subscribe(async (event: any): Promise<any> => {
      if (event instanceof NavigationEnd && event.url) {
        this._history.push(event.urlAfterRedirects);
        this._history = this._history.slice(-10);
      }
    });

    // Define pause event handler (only Cordova)
    this._platform.pause.subscribe(async () => {
      console.info('Pause event detected');
    });

    // Define resume event handler (only Cordova)
    this._platform.resume.subscribe(async () => {
      console.info('Resume event detected');
    });

    // Define resize event handler
    this._platform.resize.subscribe(async () => {
      console.info('Resize event detected');
    });

    // Init
    this.onInit();
  }

  /**
   * Init event handler
   */
  async onInit(): Promise<any> {

    this.user = await this.getUser();
    this.user = this.user || undefined;

    // Define http config
    this.http._config.url = this._config.http?.url || '';
    this.http._config.uri = this._config.http?.uri || '';
    this.http._config.api = this._config.http?.api || '';
    this.http._config.headers = this._config.http?.headers || {};

    if (this.user?._access?.headers) {
      this.http._config.headers = this.user._access.headers || {};
    }

    // // Define user token
    // try {
    //   const index = `${this._config.http.token?.index || 'authorization'}`;
    //   const value = `${this._config.http.token?.value || 'Bearer {token}'}`;
    //   const field = `${this._config.http.token?.field || 'access_token'}`;
    //
    //   this.http._config.headers = this._config.http.headers || {};
    //   if (this.user && this.user[`${field}`]) {
    //     this.http._config.headers[`${index}`] = `${value}`.replace('{token}', this.user[`${field}`]);
    //   } else {
    //     this.http._config.headers[`${index}`];
    //   }
    // } catch (error) {
    //   console.error(error);
    // }

    // Define i18n config
    this.i18n = {};
    this.i18n.calendar = this._config.i18n?.calendar || 'es-AR-u-hc-h23';
    this.i18n.language = this._config.i18n?.language || 'es';
    this.i18n.region = this._config.i18n?.region || 'ar';
    this.i18n.values = await this.http.request({method: 'GET', url: `assets/i18n/${this.i18n.language}.json`});

    // Define menu
    this.menu = undefined;

    // Define menu (user)
    if (this.user) {
      this.menu = {};
      this.menu.title = this.user?._config?.menu?.title || undefined;
      this.menu.label = this.user?._config?.menu?.label || undefined;
      this.menu.image = this.user?._config?.menu?.image || undefined;

      // Define menu items
      this.menu.mainMenu = [];
      this.menu.userMenu = [];
      for (const p of this._config.views) {
        if (p.menu === 'main' && p.auth?.includes(this.user._access?.auth || 'anonymous')) {
          this.menu.mainMenu.push({
            title: this.formatI18n(`${p.name}.header.title`) || p.name,
            label: this.formatI18n(`${p.name}.header.label`),
            image: this.formatI18n(`${p.name}.header.image`),
            icon: this.formatI18n(`${p.name}.header.icon`) || 'search',
            path: p.path
          });
          continue;
        }
        if (p.menu === 'user' && p.auth?.includes(this.user._access?.auth || 'anonymous')) {
          this.menu.userMenu.push({
            title: this.formatI18n(`${p.name}.header.title`) || p.name,
            label: this.formatI18n(`${p.name}.header.label`),
            image: this.formatI18n(`${p.name}.header.image`),
            icon: this.formatI18n(`${p.name}.header.icon`) || 'people',
            path: `${p.path}`
          });
          continue;
        }
      }

      if (this.user._config) {
        if (this.user._access.auth) {
          this.menu.userMenu.push({
            title: this.user._config.night ? 'Activa el modo claro' : 'Activa el modo oscuro',
            label: '',
            image: '',
            icon: this.user._config.night ? 'sunny' : 'moon',
            onSetup: (item: any) => {
              item.title = this.user._config.night ? 'Activa el modo claro' : 'Activa el modo oscuro';
              item.icon = this.user._config.night ? 'sunny' : 'moon';
            },
            onClick: (item: any) => {
              //this.toggleNight();
              document.body.classList.toggle('night', (this.user._config.night = !this.user._config.night));
              item.onSetup(item);
            }
          });
        }
      }
    }

    // // Define config
    // const config: any = {...this._config};
    // const places: any = ['page', 'menu'];
    // const values: any = ['background_color', 'border_color', 'text_color', 'content_color'];
    // for (const place of places) {
    //   for (const value of values) {
    //     if (typeof config[`${place}_${value}`] !== 'undefined') {
    //       document.documentElement.style.setProperty(`__flb_${place}_${value}`.replace(/_/g, '-'), config[`${place}_${value}`]);
    //     } else {
    //       document.documentElement.style.removeProperty(`__flb_${place}_${value}`.replace(/_/g, '-'));
    //     }
    //   }
    // }

    // Define html title
    const $title: any = document.querySelector('title');
    if ($title && this.menu?.title) {
      $title.innerText = this.menu.title;
    }

    // Define html color
    const $color: any = document.querySelector('meta[name=theme-color]');
    if ($color && this.menu?.color) {
      $color.setAttribute('content', this.menu.color);
    }

    // Define html icons
    const $icons: any = document.querySelectorAll('link[rel=icon]');
    if ($icons && this.menu?.image) {
      [...$icons].map(($icon: any) => $icon.setAttribute('href', this.menu.image));
    }

    // Define menu classes
    if (this.menu) {
      document.body.classList.toggle('flb-menu', true);
      document.body.classList.toggle('flb-menu-show', true);
      document.body.classList.toggle('flb-menu-hide', false);
      document.body.style.setProperty('--flb-body-background', `unset`);
    } else {
      document.body.classList.toggle('flb-menu', false);
      document.body.classList.toggle('flb-menu-show', false);
      document.body.classList.toggle('flb-menu-hide', false);
      document.body.style.setProperty('--flb-body-background', `#222 url("https://www.flip-b.com/assets/backgrounds/background-${('000' + (Math.floor(Math.random() * 440) + 1)).substr(-3)}.jpg") 0 0/100% 100% no-repeat`);
    }
  }

  /*********************************************************************************************************************
   *********************************************************************************************************************
   ***
   *** Support methods
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * Get user values
   */
  async getUser(): Promise<any> {
    try {
      return this._storage.getItem(this._config.user.key) ? JSON.parse(this._storage.getItem(this._config.user.key) || '{}') : false;
    } catch (error: any) {
      console.log(`UserService.setUser error ${error}`);
    }
  }

  /**
   * User update
   */
  async setUser(user: any): Promise<any> {
    try {
      this._storage.setItem(this._config.user.key, JSON.stringify(user));
    } catch (error: any) {
      console.log(`UserService.setUser error ${error}`);
    }
  }

  /**
   * User remove
   */
  async removeUser(): Promise<any> {
    try {
      sessionStorage.removeItem(this._config.user.key);
      sessionStorage.clear();
    } catch (error: any) {
      console.log(`UserService.remove error ${error}`);
    }
  }

  /**
   * Auth
   */
  async auth(path: string): Promise<boolean> {
    try {
      path = path.split('?')[0];
      for (const view of this._config.views) {
        if (view.path === path) {
          return view.auth.includes(this.user?._access?.auth || 'anonymous');
        }
      }
      return false;
    } catch (error: any) {
      console.error(`Attention, "auth": ${error}`);
      return false;
    }
  }

  /**
   * Goto
   */
  async goto(path: string, params: any = {}, options: any = {}): Promise<any> {
    try {

      if (typeof params.setUser !== 'undefined') {
        await this.setUser(params.setUser);
        await this.onInit();
      }

      path = this.formatUrlParameters(path, params);
      options.state = params;
      options.replaceUrl = true;
      return await this._router.navigate([path], options);
    } catch (error: any) {
      console.error(`Attention, "goto": ${error}`);
      return false;
    }
  }

  /**
   * Goto root
   */
  async gotoRoot(path = '', params: any = {}, options: any = {}): Promise<any> {
    try {
      this._history = [];
      return await this.goto(path, params, options);
    } catch (error: any) {
      console.error(`Attention, "gotoRoot": ${error}`);
      return false;
    }
  }

  /**
   * Goto back
   */
  async gotoBack(): Promise<any> {
    try {
      const history = this._history[this._history.length - 2] || '';
      this._history = this._history.slice(0, -2);
      return await this.goto(history);
    } catch (error: any) {
      console.error(`Attention, "gotoBack": ${error}`);
      return false;
    }
  }

  /*********************************************************************************************************************
   *********************************************************************************************************************
   ***
   *** Support methods
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * Clone
   */
  clone(value: any): any {
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

  /*********************************************************************************************************************
   *********************************************************************************************************************
   ***
   *** Form
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

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

  /*********************************************************************************************************************
   *********************************************************************************************************************
   ***
   *** Menu
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * Menu image error event handler
   */
  async _onMenuImageError($event: any): Promise<any> {
    try {
      $event.stopPropagation();
      $event.preventDefault();
      $event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mP8/58BAzAOZUEA5OUT9xiCXfgAAAAASUVORK5CYII=';
    } catch (error: any) {
      console.error(`Attention, "_onMenuImageError": ${error}`);
    }
  }

  /**
   * Menu button click event handler
   */
  async _onMenuButtonClick($event: any): Promise<any> {
    try {
      $event.stopPropagation();
      $event.preventDefault();
      document.body.classList.toggle('flb-menu-hide');
      document.body.classList.toggle('flb-menu-show');
      this._ionMenu.open();
    } catch (error: any) {
      console.error(`Attention, "_onMenuButtonClick": ${error}`);
    }
  }

  /**
   * Menu toggle click event handler
   */
  async _onMenuToggleClick($event: any): Promise<any> {
    try {
      $event.stopPropagation();
      $event.preventDefault();
      document.body.classList.toggle('flb-menu-hide', false);
      document.body.classList.toggle('flb-menu-show', true);
      this._ionMenu.toggle();
    } catch (error: any) {
      console.error(`Attention, "_onMenuToggleClick": ${error}`);
    }
  }

  /*********************************************************************************************************************
   *********************************************************************************************************************
   ***
   *** Support methods
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * Show loading
   */
  async showLoading(params: any = {}): Promise<any> {
    this._loading = null;
    this._loadingController.dismiss('loading').catch(() => true);

    const loading = (this._loading = `${new Date().getTime()}-${Math.random()}`);
    await new Promise((r: any) => setTimeout(r, params.delay || 1500));
    if (loading !== this._loading) {
      return;
    }

    if (params.message) {
      params.message = this.formatI18n(params.message, params.value);
    }

    if (params.message) {
      const object: any = await this._loadingController.create({cssClass: 'flb', id: 'loading', message: params.message, duration: params.duration || 1000});
      await object.present();
    }
  }

  /**
   * Show message
   */
  async showMessage(params: any = {}): Promise<any> {
    this._loading = null;
    this._loadingController.dismiss('loading').catch(() => true);

    if (params.message) {
      params.message = this.formatI18n(params.message);
    }

    if (params.error) {
      params.message = this.formatI18n(`page.status.${params.error?.status || '500'}.warning`) || params.message;
      params.color = params.color || 'danger';
      params.duration = params.duration || 6000;
    } else {
      params.color = params.color || 'success';
      params.duration = params.duration || 1000;
    }

    if (params.message) {
      const object: any = await this._ionToast.create({cssClass: 'flb', message: params.message, color: params.color, duration: params.duration});
      await object.present();
    }

    if (params.message && params.error?.status === 402) {
      console.log('ERROR', params.error?.status);
      //this.gotoRoot('user/signin', {setUser: false});
    }
  }

  /**
   * Show view
   */
  async showView(params: any = {}): Promise<any> {
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

  /*********************************************************************************************************************
   *********************************************************************************************************************
   ***
   *** Support methods
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * Toggle night mode
   */
  //async toggleNight($event: any = undefined): Promise<any> {
  //  if ($event) {
  //    $event.stopPropagation();
  //    $event.preventDefault();
  //  }
  //  document.body.classList.toggle('night', (this.user._config.night = !this.user._config.night));
  //}

  async showConfirmDialog(params: any = {}): Promise<any> {
    return await new Promise(async (resolve: any) => {
      const alert = await this._ionAlert.create({
        header: params.header || '',
        inputs: params.inputs || [],
        buttons: [
          {text: this.formatI18n('$page.accept.title'), handler: resolve},
          {text: this.formatI18n('$page.cancel.title'), role: 'cancel', cssClass: 'secondary', handler: resolve}
        ]
      });
      await alert.present();
    });
  }

  /**
   * Show content download
   */
  async showContentDownload(params: any = {}): Promise<any> {
    return await new Promise(async (resolve: any, reject: any) => {
      try {
        const subject =
          params.name ||
          ((params.value.headers.get('content-disposition') || 'download.pdf').split('filename=').pop() || '')
            .replace(/^("|')?(.*?)("|')?$/, '$2')
            .replace(/\s\s+/g, ' ')
            .trim();
        const element = document.createElement('a');
        element.href = URL.createObjectURL(params.value.body);
        element.style.display = 'none';
        element.download = subject;
        element.click();
        resolve();
      } catch (error: any) {
        reject(error);
      }
    });
  }

  /**
   * Show content print
   */
  async showContentPrint(params: any = {}): Promise<any> {
    return await new Promise(async (resolve: any, reject: any) => {
      try {
        const element = document.createElement('iframe');
        element.src = URL.createObjectURL(params.value.body);
        element.style.display = 'none';
        element.onload = () => {
          element.focus();
          element.contentWindow?.print();
        };
        document.body.appendChild(element);
        resolve();
      } catch (error: any) {
        reject(error);
      }
    });
  }

  /**
   * Show content share
   */
  async showContentShare(params: any = {}): Promise<any> {
    return await new Promise(async (resolve: any, reject: any) => {
      try {
        try {
          navigator.share(params.value.body);
        } catch (e: any) {
          navigator.clipboard.writeText(params.value.body);
        }
        resolve();
      } catch (error: any) {
        reject(error);
      }
    });
  }

  /**
   * Show content sendmail
   */
  async showContentSendmail(params: any = {}): Promise<any> {
    return await new Promise(async (resolve: any, reject: any) => {
      try {
        try {
          navigator.share(params.value.body);
        } catch (e: any) {
          navigator.clipboard.writeText(params.value.body);
        }
        resolve();
      } catch (error: any) {
        reject(error);
      }
    });
  }

  /*********************************************************************************************************************
   *********************************************************************************************************************
   ***
   *** Format
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * Format i18n
   */
  formatI18n(type: any, item: any = undefined, data: any = undefined): any {
    if (type === 'value') {
      return item?.value || {};
    }
    if (item && data) {
      item.__counter = (item.__counter || 0) + 1;
    }

    if (item?.value && typeof item.value[type] !== 'undefined') {
      return item.value[type];
    }

    if (item?.text && typeof item.text[type] !== 'undefined') {
      return item?.text[type];
    }

    if (item?._i18n) {
      type = `${item._i18n}.${type}`;
    }

    const parts = `${type || ''}`.toLowerCase().split('.');

    const index = parts.shift();

    const count = parts.length;

    const tests = [`${index}`, '$page', '$text'];

    let result: any;
    for (let i = 0; i < count; i++) {
      const value = parts.join('.');
      parts.shift();

      for (const t of tests) {

        //if (this.i18n.values[`${t}`] && this.i18n.values[`${t}`][`${value}[${this.i18n.region}]`]) {
        //  result = this.i18n.values[`${t}`][`${value}[${this.i18n.region}]`];
        //  break;
        //}

        if (typeof this.i18n.values[`${t}`] === 'object' && typeof this.i18n.values[`${t}`][`${value}`] === 'string') {
          result = this.i18n.values[`${t}`][`${value}`];
          break;
        }
      }

      if (typeof result !== 'undefined') {
        break;
      }
    }

    result = result || '';

    if (!result && type.match(/title$/i)) {
      result = item?._config?.name || '';
    }

    result = result.toString();

    result = result.replace(/\s\s+/g, ' ').trim();

    const replacements: any = [...result.matchAll(/\{\{.*?\}\}/g)];
    for (const r of replacements) {
      result = result.replace(r.input, this.formatI18n(r.input.replace('{{', '').replace('}}', '').trim()));
    }

    if (item) {
      for (const i in item) {
        result = result.replace(`{{${i}}}`, item[i]);
      }
    }

    result = result.replace(/\{\{.*?\}\}/g, '').trim();
    result = result.replace(/\s\s+/g, ' ').trim();

    //result = type + ` "${result}"`;
    return result;
  }

  /**
   * Format input string
   */
  formatInputString(value: any): any {
    let result = value || '';
    result = result.toString();
    return result;
  }

  /**
   * Format input number
   */
  formatInputNumber(value: any): any {
    let result = value || 0;
    result = parseFloat(result);
    return result;
  }

  /**
   * Format input number positive
   */
  formatInputNumberPositive(value: any): any {
    let result = value || 0;
    result = this.formatInputNumber(result);
    result = Math.abs(result);
    return result;
  }

  /**
   * Format input number negative
   */
  formatInputNumberNegative(value: any): any {
    let result = value || 0;
    result = this.formatInputNumber(result);
    result = Math.abs(result) * -1;
    return result;
  }

  /**
   * Format input object
   */
  formatInputObject(value: any): any {
    const result = value || {};
    return result;
  }

  /**
   * Format input date
   */
  formatInputDate(value: any): string {
    if (!value) {
      return '';
    }
    const p = (n: any) => {
      const v = Math.floor(Math.abs(n));
      return (v < 10 ? '0' : '') + v;
    };
    const date = new Date(value);
    const t = date.getTimezoneOffset() * -1;
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const i = date.getMinutes();
    const s = date.getSeconds();
    return `${y}-${p(m)}-${p(d)}T${p(h)}:${p(i)}:${p(s)}${t >= 0 ? '+' : '-'}${p(t / 60)}:${p(t % 60)}`;
  }

  /**
   * Format input boolean
   */
  formatInputBoolean(value: any): string {
    let result = value || false;
    result = ['true', 'yes', '1', true].includes(value) ? true : false;
    return result;
  }

  /**
   * Format human string
   */
  formatHumanString(value: any): any {
    const result = value || '';
    return result;
  }

  /**
   * Format human number
   */
  formatHumanNumber(value: any): any {
    let result = this.formatInputNumber(value);
    result = Math.round((result + Number.EPSILON) * 100) / 100;
    const values = result.toString().split('.');
    result = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + ((values[1] ? values[1].substr(0, 2) : '') + '00').substr(0, 2);
    result = result.trim();
    return result;
  }

  /**
   * Format human datetime
   */
  formatHumanDatetime(value: any): any {
    let result = value ? this.formatInputDate(value) : '';
    result = result.toString();
    result = result.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2}).([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)?/, (...v: any) => {
      return 'd/m/y h:i:s'.trim().replace(/y+/i, v[1]).replace(/m+/i, v[2]).replace(/d+/i, v[3]).replace(/h+/i, v[4]).replace(/i+/i, v[5]).replace(/s+/i, v[6]);
    });
    return result;
  }

  /**
   * Format human date
   */
  formatHumanDate(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})(.*)/, (...v: any) => {
      return 'd/m/y'.trim().replace(/y+/i, v[1]).replace(/m+/i, v[2]).replace(/d+/i, v[3]);
    });
    return result;
  }

  /**
   * Format human time
   */
  formatHumanTime(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.replace(/([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, (...v: any) => {
      return 'h:i:s'.trim().replace(/h+/i, v[1]).replace(/i+/i, v[2]).replace(/s+/i, v[3]);
    });
    return result;
  }

  /**
   * Format human year
   */
  formatHumanYear(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.replace(/^([0-9]{4})$/, '$1');
    return result;
  }

  /**
   * Format human year-month
   */
  formatHumanYearMonth(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.replace(/^([0-9]{4})-([0-9]{2})$/, '$2/$1');
    return result;
  }

  /**
   * Format human URL
   */
  formatHumanUrl(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.toLowerCase();
    result = result.trim();
    return result;
  }

  /**
   * Format human phone
   */
  formatHumanPhone(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.toLowerCase();
    result = result.trim();
    return result;
  }

  /**
   * Format human email
   */
  formatHumanEmail(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.toLowerCase();
    result = result.trim();
    return result;
  }

  /**
   * Format human color
   */
  formatHumanColor(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.toLowerCase();
    result = result.trim();
    return result;
  }

  /**
   * Format human location
   */
  formatHumanLocation(value: any): any {
    if (typeof value == 'object' && value) {
      value = [value.street, value.city, value.state].filter((v) => !!v).join(', ');
    }
    let result = value || '';
    result = result.toString();
    result = result.trim();
    return result;
  }

  /**
   * Format address
   */
  formatAddress(params: any) {
    const current: any = {};
    params.address_components.forEach((r: any) => {
      if (r.types.includes('route')) {
        current.street = this.formatI18n(r.short_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('street_number') && current.street) {
        current.street = current.street + ' ' + this.formatI18n(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('administrative_area_level_2')) {
        current.city = this.formatI18n(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('locality')) {
        current.city = this.formatI18n(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('administrative_area_level_1')) {
        current.state = this.formatI18n(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('country')) {
        current.country = this.formatI18n(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('postal_code')) {
        current.zipcode = this.formatI18n(r.long_name);
      }
    });

    //if (this.value.street && params.keep_street) {
    //  current.street = this.formatI18n(this.value.street);
    //}
    if (!current.street && params.formatted_address) {
      current.street = params.formatted_address.split(',')[0].trim();
    }
    if (!current.city || current.city.match(/^capital/i)) {
      current.city = current.state;
    }

    return current;

    //const position: any = {
    //  lat: params.geometry.location.lat(),
    //  lng: params.geometry.location.lng()
    //};
    //this.value = current;
    //this.value.position = [position.lat, position.lng];
    //this.google.map.setCenter(position);
    //this.google.marker.setPosition(position);
    //console.log('New value', this.value);
  }

  /**
   * Format human address text
   */
  formatString(value: any): string {
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
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }

  /**
   * Format human path
   */
  formatUrlParameters(value = '', params: any = {}): string {
    for (const p in params) {
      value = value.replace(new RegExp(':' + p), params[p]);
    }
    return value;
  }
}
