import {Injectable, Inject} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

import {HttpService} from './http.service';
import {I18nService} from './i18n.service';
import {UserService} from './user.service';

import {LoadingController, AlertController, ModalController, ToastController, MenuController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Definitions

  _loading: any = false;
  _routerHistory: any = [];

  /**
   * Constructor
   */
  constructor(
    @Inject('config') public _config: any = {},
    public http: HttpService,
    public i18n: I18nService,
    public user: UserService,
    public _ionAlert: AlertController,
    public _ionLoading: LoadingController,
    public _ionMenu: MenuController,
    public _ionModal: ModalController,
    public _ionToast: ToastController,
    public _router: Router
  ) {

    // Fucking shadow-root
    setInterval(() => {
      const $elements: any = document.querySelectorAll('ion-popover ion-datetime');
      [...($elements || [])].map(($element: any) => {
        if ($element?.shadowRoot) {
          const $target: any = $element.shadowRoot.querySelector('.calendar-month-year');
          if ($target) {
            $target.style.width = '150px';
          }
        }
      });
    }, 500);
  
    this._router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && event.url) {
        this._routerHistory.push(event.url);
        this._routerHistory = this._routerHistory.slice(-10);
      }
    });

    this.user._events.subscribe((event: any) => {
      console.log('USER', event)
    });

    this.i18n._events.subscribe((event: any) => {
      console.log('I18N', event)
    });
   
    this.onInit();
  }

  /**
   * Init event handler
   */
  async onInit(): Promise<any> {

    // Define http config
    this.http._config.url = this._config.http?.url || '';
    this.http._config.uri = this._config.http?.uri || '';
    this.http._config.headers = this._config.http?.headers || {};
    this.http._config.headers = {
      Authorization:
        'Baerer ' +
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiNjMxOWRjM2RiZGM1MmRhZWY4Yjk4YmQ3IiwicGxhY2UiOiI2MzE5ZGM0OTBhYzYwZWRhMGMxMDgxNWUiLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsInVzZXIiOiI2MzE5ZGM0YTRkYThlOGZiNDQzOGZjYWMiLCJjb3VudHJ5IjoiZXMtQVIiLCJpYXQiOjE2NjI5ODkxMzMsImV4cCI6MTY2MzA3NTUzM30.EFCG2CQhEjoE3ptX6SQgbt4uXHbX_S4jnccbpkISovo'
    };

    this.user.auth({
      name: 'Administrator',
      email: 'administrator@flip-b.com', 
      token: this.http._config.headers.Authorization
    })

    // Define user token
    try {
      const index = `${this._config.http.token?.index || 'authorization'}`;
      const value = `${this._config.http.token?.value || 'Bearer {token}'}`;
      const field = `${this._config.http.token?.field || 'access_token'}`;

      //this.http._config.headers = this._config.http.headers || {};
      //if (this.user && this.user[`${field}`]) {
      //this.http._config.headers[`${index}`] = `${value}`.replace('{token}', this.user[`${field}`]);
      //} else {
      //this.http._config.headers[`${index}`];
      //}
    } catch (error) {
      console.error(error);
    }

    // Define i18n config
    this.i18n._config.locale = this._config.i18n?.locale || 'es-AR-u-hc-h23';
    this.i18n._config.language = 'es';
    this.i18n._config.region = 'ar';
    this.i18n._config.values = await this.http.request({method: 'GET', url: `assets/i18n/${this.i18n._config.language}.json`});

    // Define menu config
    this.user._config.title = this._config.menu?.title || this.i18n.format('page.global.title') || '';
    this.user._config.label = this._config.menu?.label || this.i18n.format('page.global.label') || '';
    this.user._config.image = this._config.menu?.image || this.i18n.format('page.global.image') || '';
    this.user._config.route_1 = '';
    this.user._config.route_2 = '';

    // Define menu items
    this.user._config.items = [];
    for (const p of this._config.views) {
      //if (p.auth && p.auth.includes(this.user?.access || 'anonymous')) {
      if (p.menu === 'primary') {
        this.user._config.items.push({
          title: this.i18n.format(`${p.name}.title`),
          label: this.i18n.format(`${p.name}.label`),
          image: this.i18n.format(`${p.name}.image`),
          icon: this.i18n.format(`${p.name}.icon`),
          path: `${p.path}`
        });
      } else if (p.menu === 'route-1') {
        this.user._config.route_1 = `${p.path}`;
      } else if (p.menu === 'route-2') {
        this.user._config.route_2 = `${p.path}`;
      }
      //}
    }

    // // Define config
    // const config: any = {...this._config};
    
    // // Define html attributes
    // const places: any = ['page', 'menu'];
    // const values: any = ['background', 'background_color', 'background_color_rgb', 'text_color', 'text_color_rgb', 'border_color', 'content_color'];
    // for (const place of places) {
    //   for (const value of values) {
    //     if (typeof config[`${place}_${value}`] !== 'undefined') {
    //       document.documentElement.style.setProperty(`__flb_${place}_${value}`.replace(/_/g, '-'), config[`${place}_${value}`]);
    //     } else {
    //       document.documentElement.style.removeProperty(`__flb_${place}_${value}`.replace(/_/g, '-'));
    //     }
    //   }
    // }
    
    // site_background: `#222 url("https://www.flip-b.com/assets/backgrounds/background-${('000' + (Math.floor(Math.random() * 440) + 1)).substr(-3)}.jpg") 0 0/100% 100% no-repeat`,
    // // Define html title
    // const $title: any = document.querySelector('title');
    // if ($title && this.menu.title) {
    //  $title.innerText = this.menu.title;
    // }
    
    // // Define html color
    // const $color: any = document.querySelector('meta[name=theme-color]');
    // if ($color && this.menu.color) {
    //  $color.setAttribute('content', this.menu.color);
    // }
    
    // // Define html icons
    // const $icons: any = document.querySelectorAll('link[rel=icon]');
    // if ($icons && this.menu.image) {
    //  [...$icons].map(($icon: any) => $icon.setAttribute('href', this.menu.image));
    // }
    
    // // Verify html user
    // if (this.user) {
    //  document.body.classList.toggle('user', true);
    // } else {
    //  document.body.classList.toggle('user', false);
    // }

    document.body.classList.toggle('user', true);
  }

  /**
   * Auth
   */
  async auth(url: string): Promise<boolean> {
    // for (const view of this._config.views) {
    //   if (`${view.path}` === url && view.auth && view.auth.includes((this.user._config || {}).access || 'anonymous')) {
    //     return true;
    //   }
    // }
    // return false;
    return !!url;
  }

  /**
   * Goto
   */
  async goto(url = '', params: any = {}, options: any = {}): Promise<any> {
    try {
      url = this.i18n.replaceStringParameters(url, params);
      options.replaceUrl = true;
      options.state = params;
      return await this._router.navigate([url], options);
    } catch (error: any) {
      console.error(`${error}`);
    }
  }

  /**
   * Goto root
   */
  async gotoRoot(url = '', params: any = {}, options: any = {}): Promise<any> {
    try {
      url = this.i18n.replaceStringParameters(url, params);
      options.replaceUrl = true;
      options.state = params;
      this._routerHistory = [];
      return await this._router.navigate([url], options);
    } catch (error: any) {
      console.error(`${error}`);
    }
  }

  /**
   * Goto back
   */
  async gotoBack(url = '', params: any = {}, options: any = {}): Promise<any> {
    try {
      url = this.i18n.replaceStringParameters(url || this._routerHistory[this._routerHistory.length - 2], params);
      this._routerHistory = this._routerHistory.slice(0, -2);
      options.replaceUrl = true;
      options.state = params;
      return await this._router.navigate([url], options);
    } catch (error: any) {
      console.error(`${error}`);
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
   * Load menu
   */
  async loadMenu(): Promise<any> {
    const result: any = {};
    return result;
  }

  /**
   * Load page
   */
  async loadPage(params: any = {}): Promise<any> {
    let result: any = {};
    const snap: any = this._router.routerState.snapshot.root.firstChild;
    const data: any = snap.data.page || {};
    const page: any = {...params};
    page.name = page.name || data.name || undefined;
    page.type = page.type || data.type || undefined;
    page.mode = page.mode || data.mode || undefined;
    page.load = page.load || data.load || undefined;
    page.params = this.clone({...snap.params, ...snap.queryParams, ...history.state});
    delete page.params.navigationId;
    if (typeof page.load === 'function') {
      result = {...this.clone(page), ...this.clone(await page.load())};
    }
    return result;
  }

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
   *** Support methods
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * Show loading
   */
  async showLoading(params: any = {}): Promise<any> {
    await this.hideLoading();
    const loading = (this._loading = `${new Date().getTime()}-${Math.random()}`);
    await new Promise((r: any) => setTimeout(r, params.delay || 1000));
    if (loading !== this._loading) {
      return;
    }
    if (params.message) {
      const text = this.i18n.format(params.message, params.value) || params.message;
      if (text && text !== params.message) {
        params.message = text;
      } else {
        params.message = undefined;
      }
    }
    if (params.message) {
      const object: any = await this._ionLoading.create({cssClass: 'flb', id: 'loading', message: params.message, duration: params.duration || 1000});
      await object.present();
    }
  }

  /**
   * Show message
   */
  async showMessage(params: any = {}): Promise<any> {
    await this.hideLoading();
    if (params.message) {
      const text = this.i18n.format(params.message, params.value) || params.message;
      if (text && text !== params.message) {
        params.message = text;
      } else {
        params.message = undefined;
      }
    }
    if (params.error) {
      params.message = this.i18n.format(`page.status.${params.error?.status || '500'}.warning`) || params.message;
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
      //await this.store();
      //this.goto('user/signin');
    }
  }

  /**
   * Hide loading
   */
  async hideLoading(): Promise<any> {
    this._loading = null;
    this._ionLoading.dismiss('loading').catch(() => true);
  }

  /**
   * Toggle night mode
   */
  async toggleNight($event: any = undefined): Promise<any> {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    document.body.classList.toggle('night', (this.user._config.night = !this.user._config.night));
  }

  /**
   * Show menu
   */
  async showMenu($event: any = undefined): Promise<any> {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this._ionMenu.open();
  }

  /**
   * Show view
   */
  async showView(params: any = {}): Promise<any> {
    await this.hideLoading();
    if (typeof params.$event?.target?.complete === 'function') {
      params.$event.target.complete();
    }
    const modal = await this._ionModal.create({cssClass: 'flb', component: params.component, componentProps: params.componentProps});
    await modal.present();
    const result: any = await modal.onDidDismiss();
    if (result && result.data) {
      return result.data;
    } else {
      return null;
    }
  }

  /**
   * Show form
   */
  async showForm(params: any = {}): Promise<any> {
    return await new Promise(async (resolve: any) => {
      const alert = await this._ionAlert.create({
        header: params.header || '',
        inputs: params.inputs || [],
        buttons: [
          {text: 'submit', handler: resolve},
          {text: 'cancel', role: 'cancel', cssClass: 'secondary', handler: resolve}
        ]
      });
      await alert.present();
    });
  }

  /*********************************************************************************************************************
   *********************************************************************************************************************
   ***
   *** Page
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * Page search event handler
   */
  async _onPageSearch($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.search.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/`,
        method: 'GET'
      });

      page.setHeader([{header: {menu: true, search: true, modal: page._component.modal}}]);
      page._config._setResult(result);

      this.showMessage({message: `${page._config.name}.search.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.search.warning`, $event, error});
    }
  }

  /**
   * Page select event handler
   */
  async _onPageSelect($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.select.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/${page._config.params._id || ''}`,
        method: 'GET'
      });

      page._config._setHeader([result]);
      page._config._setResultValue([result]);

      this.showMessage({message: `${page._config.name}.select.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.select.warning`, $event, error});
    }
  }

  /**
   * Page create event handler
   */
  async _onPageCreate($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.create.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/`,
        method: 'POST',
        body: page._config.params
      });

      this.showMessage({message: `${page._config.name}.create.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.create.warning`, $event, error});
    }
  }

  /**
   * Page update event handler
   */
  async _onPageUpdate($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.update.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/${page._config.params._id || ''}`,
        method: 'PUT',
        body: page._config.params
      });

      this.showMessage({message: `${page._config.name}.update.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.update.warning`, $event, error});
    }
  }

  /**
   * Page delete event handler
   */
  async _onPageDelete($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.delete.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/${page._config.params._id || ''}`,
        method: 'DELETE'
      });

      this.showMessage({message: `${page._config.name}.delete.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.delete.warning`, $event, error});
    }
  }

  /**
   * Page export event handler
   */
  async _onPageExport($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.export.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/export`,
        method: 'POST',
        body: page._config.params
      });

      this.showMessage({message: `${page._config.name}.export.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.export.warning`, $event, error});
    }
  }

  /**
   * Page import event handler
   */
  async _onPageImport($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.import.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/import`,
        method: 'POST',
        body: page._config.params
      });

      this.showMessage({message: `${page._config.name}.import.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.import.warning`, $event, error});
    }
  }

  /**
   * Page submit event handler
   */
  async _onPageSubmit($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.submit.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/${page._config.params._id || ''}`,
        method: 'POST',
        body: page._config.params
      });

      this.showMessage({message: `${page._config.name}.submit.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.submit.warning`, $event, error});
    }
  }

  /**
   * Page cancel event handler
   */
  async _onPageCancel($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.cancel.loading`, $event});

      const result: any = {};

      this.showMessage({message: `${page._config.name}.cancel.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.cancel.warning`, $event, error});
    }
  }

  /**
   * Page upload event handler
   */
  async _onPageUpload($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.upload.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/upload`,
        method: 'POST',
        form: page._config.params
      });

      this.showMessage({message: `${page._config.name}.upload.success`, $event, value: result});
    } catch (error) {
      this.showMessage({message: `${page._config.name}.upload.warning`, $event, error});
    }
  }

  /**
   * Page download event handler
   */
  async _onPageSelectAndDownload($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.download.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/${page._config.params._id || ''}`,
        method: 'GET',
        qs: {event: 'download'},
        type: 'blob',
        observe: 'response'
      });

      const subject = ((result.headers.get('content-disposition') || 'download.pdf').split('filename=').pop() || '')
        .replace(/^("|')?(.*?)("|')?$/, '$2')
        .replace(/\s\s+/g, ' ')
        .trim();
      const element = document.createElement('a');
      element.href = URL.createObjectURL(result.body);
      element.style.display = 'none';
      element.download = subject;
      element.click();

      this.showMessage({message: `${page._config.name}.download.success`, $event, value: result});
    } catch (error: any) {
      this.showMessage({message: `${page._config.name}.download.warning`, $event, error});
    }
  }

  /**
   * Page print event handler
   */
  async _onPageSelectAndPrint($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.print.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/${page._config.params._id || ''}`,
        method: 'GET',
        qs: {event: 'print'},
        type: 'blob',
        observe: 'response'
      });

      const element = document.createElement('iframe');
      element.src = URL.createObjectURL(result.body);
      element.style.display = 'none';
      element.onload = () => {
        element.focus();
        element.contentWindow?.print();
      };
      document.body.appendChild(element);

      this.showMessage({message: `${page._config.name}.print.success`, $event, value: result});
    } catch (error: any) {
      this.showMessage({message: `${page._config.name}.print.warning`, $event, error});
    }
  }

  /**
   * Page share event handler
   */
  async _onPageSelectAndShare($event: any, page: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.share.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/${page._config.params._id || ''}`,
        method: 'GET',
        qs: {event: 'share'},
        type: 'blob',
        observe: 'response'
      });

      navigator.share ? navigator.share(result.body) : navigator.clipboard.writeText(result.body);

      this.showMessage({message: `${page._config.name}.share.success`, $event, value: result});
    } catch (error: any) {
      this.showMessage({message: `${page._config.name}.share.warning`, $event, error});
    }
  }

  /**
   * Page sendmail event handler
   */
  async _onPageSelectAndSendmail($event: any, page: any): Promise<any> {
    try {
      const params: any = await this.showForm({
        header: 'Ingresa el E-mail',
        inputs: [{name: 'email', type: 'email', value: this.user._config.email || '', placeholder: 'E-mail'}]
      });
      if (!params?.email) {
        return;
      }

      this.showLoading({message: `${page._config.name}.send.loading`, $event});

      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/${page._config.params._id || ''}`,
        method: 'GET',
        qs: {event: 'send', email: params.email}
      });

      this.showMessage({message: `${page._config.name}.send.success`, $event, value: result});
    } catch (error: any) {
      this.showMessage({message: `${page._config.name}.send.warning`, $event, error});
    }
  }

  /**
   * Populate
   */
  async _onPageItemPopulate($event: any, page: any, item: any): Promise<any> {
    try {
      this.showLoading({message: `${page._config.name}.populate.loading`, $event});
      const result: any = await this.http.request({
        url: `${this._config.http.url}`,
        uri: `${this._config.http.uri}${this._config.http.api}/${page._config.type}/`,
        method: 'GET',
        qs: {facet: item.name}
      });

      //const value: any = await this.data.http.request(params);
      //if (this.item.require) {
      //  this.items = value.filter((r: any) => !!r.index);
      //} else {
      //  this.items = value;
      //}

      this.showMessage({message: `${page._config.name}.populate.success`, $event, value: result});
    } catch (error: any) {
      this.showMessage({message: `${page._config.name}.populate.warning`, $event, error});
    }
  }

  /*********************************************************************************************************************
   *********************************************************************************************************************
   ***
   *** Item
   ***
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * Item color click event handler
   */
  async _onItemColorClick($event: any, item: any): Promise<any> {
    try {
      if (!item._config.readonly) {
        if (!item._config.$el) {
          item._config.$el = document.createElement('input');
          item._config.$el.type = 'color';
          item._config.$el.onchange = () => {
            item.setValue(item._config.$el.value || undefined);
          };
          $event.target.parentNode.appendChild(item._config.$el);
        }
        setTimeout(() => item._config.$el.click(), 100);
      }
    } catch (error: any) {
      console.error(`${error}`);
    }
  }

  /**
   * Item files click event handler
   */
  async _onItemFilesClick($event: any, item: any): Promise<any> {
    try {
      if (!item._config.readonly) {
        if (!item._config.$el) {
          item._config.$el = document.createElement('input');
          item._config.$el.type = 'file';
          item._config.$el.accept = item._config.inputAccept || '*/*';
          item._config.$el.capture = 'environment';
          item._config.$el.onchange = () => {
            item.setValue(item._config.$el.files ? item._config.$el.files[0] : undefined);
          };
          $event.target.parentNode.appendChild(item._config.$el);
        }
        setTimeout(() => item._config.$el.click(), 100);
      }
    } catch (error: any) {
      console.error(`${error}`);
    }
  }

  /**
   * Item url click event handler
   */
  async _onItemUrlClick($event: any, item: any): Promise<any> {
    try {
      if (item.value) {
        window.open(item.value, '_system');
      }
    } catch (error: any) {
      console.error(`${error}`);
    }
  }


  /**
   * onLoadImageError
   */
  async _onLoadImageError($event: any): Promise<any> {
    try {
      $event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mP8/58BAzAOZUEA5OUT9xiCXfgAAAAASUVORK5CYII=';
    } catch (error: any) {
      console.error(`${error}`);
    }
  }
}
