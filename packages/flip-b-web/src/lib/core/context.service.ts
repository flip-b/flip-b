import {Injectable, Inject} from '@angular/core';
import {HttpService} from './http.service';
import {I18nService} from './i18n.service';
import {MenuService} from './menu.service';
import {PageService} from './page.service';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  // Definitions

  /**
   * Constructor
   */
  constructor(
    @Inject('config') public config: any,
    public http: HttpService,
    public i18n: I18nService,
    public menu: MenuService,
    public page: PageService,
    public user: UserService
  ) {
    this.onInit();
  }

  /**
   * Init event handler
   */
  async onInit(): Promise<any> {

    //const user: any = sessionStorage.getItem(`user`) ? JSON.parse(sessionStorage.getItem(`user`) || '{}') : false;
    //if (!auth?.includes(user?.access || 'anonymous')) {
    //  this.goto('user/signin');
    //}

    // Define http config
    this.http.config.url = this.config.http?.url || '';
    this.http.config.uri = this.config.http?.uri || '';
    this.http.config.headers = this.config.http?.headers || {};

    // Define user token
    try {
      const index = `${this.config.http.token?.index || 'authorization'}`;
      const value = `${this.config.http.token?.value || 'Bearer {token}'}`;
      const field = `${this.config.http.token?.field || 'access_token'}`;

      //this.http.config.headers = this.config.http.headers || {};
      //if (this.user && this.user[`${field}`]) {
        //this.http.config.headers[`${index}`] = `${value}`.replace('{token}', this.user[`${field}`]);
      //} else {
        //this.http.config.headers[`${index}`];
      //}
    } catch (error) {
      console.error(error);
    }

    // Define i18n config
    this.i18n.config.locale = this.config.i18n?.locale || 'es-AR-u-hc-h23';
    this.i18n.config.language = 'es';
    this.i18n.config.region = 'ar';
    this.i18n.config.values = await this.http.request({method: 'GET', url: `assets/i18n/${this.i18n.config.language}.json`});

    // Define menu config
    this.menu.title = this.user?.config?.site?.title || this.config.menu?.title || this.i18n.format('page.global.title') || '';
    this.menu.label = this.user?.config?.site?.label || this.config.menu?.label || this.i18n.format('page.global.label') || '';
    this.menu.image = this.user?.config?.site?.image || this.config.menu?.image || this.i18n.format('page.global.image') || '';
    this.menu.route_1 = '';
    this.menu.route_2 = '';

    // Define menu items
    this.menu.items = [];
    for (const p of this.config.views) {
      //if (p.auth && p.auth.includes(this.user?.access || 'anonymous')) {
        if (p.menu === 'primary') {
          this.menu.items.push({
            title: this.i18n.format(`${p.name}.title`),
            label: this.i18n.format(`${p.name}.label`),
            image: this.i18n.format(`${p.name}.image`),
            icon: this.i18n.format(`${p.name}.icon`),
            path: `${p.path}`
          });
        } else if (p.menu === 'route-1') {
          this.menu.route_1 = `${p.path}`;
        } else if (p.menu === 'route-2') {
          this.menu.route_2 = `${p.path}`;
        }
      //}
    }

    // Define config
    const config: any = {...this.config, ...(this.user?.config || {})};

    // Define html attributes
    const places: any = ['page', 'menu'];
    const values: any = ['background', 'background_color', 'background_color_rgb', 'text_color', 'text_color_rgb', 'border_color', 'content_color'];
    for (const place of places) {
      for (const value of values) {
        if (typeof config[`${place}_${value}`] !== 'undefined') {
          document.documentElement.style.setProperty(`__flb_${place}_${value}`.replace(/_/g, '-'), config[`${place}_${value}`]);
        } else {
          document.documentElement.style.removeProperty(`__flb_${place}_${value}`.replace(/_/g, '-'));
        }
      }
    }
    document.body.classList.toggle('user', true);
  }

  /**
   * Auth
   */
  auth(url: string): boolean {
    for (const page of this.config.views) {
      if (`${page.path}` == url && page.auth && page.auth.includes((this.user || {}).access || 'anonymous')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Goto
   */
  goto(url = '', params: any = {}, options: any = {}): void {
    url = this.page.formatNavigationUrl(url, params);
    options.replaceUrl = true;
    options.state = params;
    this.page.router.navigate([url], options);
  }








  ///**
  // * OnSubmit method
  // */
  //this.config.form = this.config.form || {};
  //this.config.form.onSubmit = async ($event: any, form: any): Promise<any> => {
  //  const params: any = await form.getValue();
  //  try {
  //    //site.page.showLoading({message: `${this.page.name}.submit.loading`, $event, params});
  //    //let result: any = undefined;
  //    //result = await this.$cx.http.request({url: 'http://localhost:30301/smartpoint', uri: `/api/v1/users/user/signin`, method: 'POST', body: params});
  //
  //    //if (typeof this.page.restful !== 'undefined' && !this.page.restful) {
  //    //  result = {...params};
  //    //} else if (this.page.mode === 'create') {
  //    //  result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/`, method: 'POST', body: params});
  //    //} else if (this.page.mode === 'update') {
  //    //  result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/${params._id}`, method: 'PUT', body: params});
  //    //} else if (this.page.mode === 'delete') {
  //    //  result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/${params._id}`, method: 'DELETE'});
  //    //} else if (this.page.mode === 'export') {
  //    //  result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/export`, method: 'POST', body: params});
  //    //} else if (this.page.mode === 'import') {
  //    //  result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/import`, method: 'POST', body: params});
  //    //} else if (this.page.mode === 'submit') {
  //    //  result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/`, method: 'POST', body: params});
  //    //}
  //    //if (form.config.onSubmitSuccess) {
  //    //  await form.config.onSubmitSuccess($event, form, result);
  //    //}
  //    //if (this.modal) {
  //    //  this.modal.dismiss({page: this, params, $event, result, action: 'submit'});
  //    //} else if (['select', 'create', 'update', 'delete', 'import', 'export'].includes(this.page.mode)) {
  //    //  this.site.page.back();
  //    //}
  //    console.log(result);
  //    //this.site.page.showMessage({message: `${this.page.name}.submit.success`, params, $event, result});
  //  } catch (error) {
  //    //this.site.page.showMessage({message: `${this.page.name}.submit.warning`, params, $event, error});
  //  }
  //};


  // /**
  //  * OnReload method
  //  */
  // async onReload($event: any = null): Promise<any> {
  //   //if (this.page.mode === 'viewer') {
  //   //  this.site.page.showMessage({message: `${this.page.name}.search.success`, $event});
  //   //  return;
  //   //}
  //   //if (this.page.onReload) {
  //   //  await this.page.onReload(this);
  //   //}
  //   if (this.page.mode === 'search') {
  //     await this.onSearch($event, this);
  //   } else {
  //     await this.onSelect($event, this);
  //   }
  //   console.log(this);
  // }
  //
  // /**
  //  * OnSearch method
  //  */
  // async onSearch($event: any = null): Promise<any> {
  //   if (!this.list) {
  //     this.list = new List(this.page, this);
  //   }
  //
  //   //if ($event?.type === 'ionInfinite') {
  //   //  //this.data.search = this.data.search || [];
  //   //} else {
  //   //  //this.data.search = [];
  //   //}
  //
  //   const params: any = {};
  //
  //   params.limit = 10;
  //
  //   //params.where = undefined;
  //   //params.query = `${this.data.params?.query || ''}` || undefined;
  //   //params.limit = parseInt(`${this.data.params?.limit || '0'}`) || undefined;
  //   //params.offset = parseInt(`${this.data.params?.offset || this.data.search.length || '0'}`) || undefined;
  //
  //   //try {
  //   //  let result: any = [];
  //   //  if (!params.offset) {
  //   //    if (typeof this.page.metric === 'undefined') {
  //   //      result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/`, method: 'GET', qs: {...params, facet: 'group'}});
  //   //    }
  //   //    if (this.page.onMetric) {
  //   //      result = await this.page.onMetric(this, params, $event, result);
  //   //    }
  //   //    //this.data.metric = this.getValues(result);
  //   //  }
  //   //} catch (error) {
  //   //  console.log(error)
  //   //}
  //
  //   try {
  //     this.site.page.showLoading({message: `${this.page.name}.search.loading`, params, $event});
  //
  //     //if (this.data._showSearch) {
  //     //  if (typeof this.page.values === 'undefined') {
  //     //    result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/`, method: 'GET', qs: {...params}});
  //     //  }
  //     //  if (typeof this.page.values === 'object') {
  //     //    result = this.page.values.filter((o: any) => !params.offset && JSON.stringify(o).match(RegExp(`${params.query || ''}`, 'i')));
  //     //  }
  //     //}
  //
  //     const result: any = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/`, method: 'GET', qs: {...params}});
  //
  //     this.list.setValue(result);
  //
  //     //if (this.page.onSearch) {
  //     //  result = await this.page.onSearch(this, params, $event, result);
  //     //}
  //     //result = this.getValues(result, this.data.values);
  //     //this.data.search = [...(this.data.search || []), ...result];
  //
  //     this.site.page.showMessage({message: `${this.page.name}.search.success`, params, $event, result});
  //   } catch (error) {
  //     this.site.page.showMessage({message: `${this.page.name}.search.warning`, params, $event, error});
  //   }
  // }
  //
  // /**
  //  * OnSelect method
  //  */
  // async onSelect($event: any = null): Promise<any> {
  //   if (!this.form) {
  //     this.form = new Form(this.page, this);
  //   }
  //
  //   const params: any = this.page.params || {};
  //   try {
  //     this.site.page.showLoading({message: `${this.page.name}.select.loading`, params, $event});
  //
  //     //let result: any = undefined;
  //     //if (typeof this.page.values === 'undefined' && ['select', 'update', 'delete'].includes(this.page.mode)) {
  //     //  result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/${params._id}`, method: 'GET'});
  //     //} else if (typeof this.page.values === 'object') {
  //     //  result = this.site.page.clone(this.page.values);
  //     //}
  //
  //     let result: any = {};
  //     if (params._id) {
  //       result = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/${params._id}`, method: 'GET'});
  //     }
  //     this.form.setValue(result);
  //
  //     this.site.page.showMessage({message: `${this.page.name}.select.success`, params, $event, result});
  //   } catch (error) {
  //     this.site.page.showMessage({message: `${this.page.name}.select.warning`, params, $event, error});
  //   }
  // }
  //
  //
  // /**
  //  * OnCancel method
  //  */
  // async onCancel($event: any = null): Promise<any> {
  //   const params: any = this.form?.getValue()
  //   try {
  //     this.site.page.showLoading({message: `${this.page.name}.cancel.loading`, params, $event});
  //
  //     let result: any = undefined;
  //     //if (typeof this.data.restful !== 'undefined' && !this.data.restful) {
  //     //  result = {...params};
  //     //}
  //
  //     if (this.page.onCancel) {
  //       await this.page.onCancel(this, params, $event, result);
  //     }
  //
  //     if (this.modal) {
  //       this.modal.dismiss({page: this, params, $event, result, action: 'cancel'});
  //     } else if (['select', 'create', 'update', 'delete', 'import', 'export'].includes(this.page.mode)) {
  //       this.site.page.back();
  //     }
  //
  //     this.site.page.showMessage({message: `${this.page.name}.cancel.success`, params, $event, result});
  //   } catch (error) {
  //     this.site.page.showMessage({message: `${this.page.name}.cancel.warning`, params, $event, error});
  //   }
  // }
  //
  // /**
  //  * OnUpload method
  //  */
  // async onUpload($event: any = null): Promise<any> {
  //   const params: any = {};
  //   try {
  //     this.site.page.showLoading({message: `${this.page.name}.upload.loading`, params, $event});
  //     let result: any = undefined;
  //     //  //this.showLoading({message: `page.dialog.loading`, params, $event});
  //     //  //const result: any = await this.site.http.request({url: `${this.page.url}`, uri: `${this.page.uri}/${this.page.path}/upload`, method: 'POST', form: params});
  //     //  //if (result?.url) {
  //     //  //  field.value = result.url;
  //     //  //}
  //     //  //await this.data.onFilesPickerOpen(this, params, $event, result);
  //     //  //if (params.options?.target) {
  //     //  //  const url: any = result?.url || null;
  //     //  //  if (params.page.target === 'image') {
  //     //  //    page.item.image = url;
  //     //  //  }
  //     //  //  page.form.controls[params.page.target].setValue(url);
  //     //  //}
  //     this.site.page.showMessage({message: `${this.page.name}.upload.success`, params, $event, result});
  //   } catch (error) {
  //     this.site.page.showMessage({message: `${this.page.name}.upload.warning`, params, $event, error});
  //   }
  // }

  // /*********************************************************************************************************************
  //  *********************************************************************************************************************
  //  ***
  //  *** Short methods
  //  ***
  //  *********************************************************************************************************************
  //  ********************************************************************************************************************/
  //
  // /**
  //  * Show page
  //  */
  // async showPage(params: any = null): Promise<any> {
  //   this.site.page.showView({component: PageComponent, componentProps: {config: params}});
  // }

  // /*********************************************************************************************************************
  //  *********************************************************************************************************************
  //  ***
  //  *** Support methods
  //  ***
  //  *********************************************************************************************************************
  //  ********************************************************************************************************************/

  // async _onClickInputDownload(input: any, $event: any): Promise<any> {
  //   const result: any = await this.site.http.request({
  //     url: `${this.page.url}`,
  //     uri: `${this.page.uri}/${this.page.path}/${this.page.params._id}`,
  //     method: 'GET',
  //     qs: {event: 'download'},
  //     type: 'blob',
  //     observe: 'response'
  //   });
  //   const subject = ((result.headers.get('content-disposition') || 'download.pdf').split('filename=').pop() || '').replace(/^("|')?(.*?)("|')?$/, '$2').replace(/\s\s+/g, ' ').trim();
  //   const element = document.createElement('a');
  //   element.href = URL.createObjectURL(result.body);
  //   element.style.display = 'none';
  //   element.download = subject;
  //   element.click();
  // }

  // async _onClickInputPrint(input: any, $event: any): Promise<any> {
  //   const result: any = await this.site.http.request({
  //     url: `${this.page.url}`,
  //     uri: `${this.page.uri}/${this.page.path}/${this.page.params._id}`,
  //     method: 'GET',
  //     qs: {event: 'print'},
  //     type: 'blob',
  //     observe: 'response'
  //   });
  //   const element = document.createElement('iframe');
  //   element.src = URL.createObjectURL(result.body);
  //   element.style.display = 'none';
  //   element.onload = () => {
  //     element.focus();
  //     element.contentWindow?.print();
  //   };
  //   document.body.appendChild(element);
  // }

  // async _onClickInputSend(input: any, $event: any): Promise<any> {
  //   const params: any = await (new Promise(async (resolve: any) => {
  //     const alert = await this.site.page.alertController.create({
  //       header: 'Ingresa el E-mail',
  //       inputs: [{name: 'email', type: 'email', value: '', placeholder: 'E-mail'}],
  //       buttons: [
  //         {text: 'Enviar', handler: resolve},
  //         {text: 'Cancelar', role: 'cancel', cssClass: 'secondary', handler: resolve}
  //       ]
  //     });
  //     await alert.present();
  //   }));
  //   if (!params.email) {
  //     return;
  //   }
  //   await this.site.http.request({
  //     url: `${this.page.url}`,
  //     uri: `${this.page.uri}/${this.page.path}/${this.page.params._id}`,
  //     method: 'GET',
  //     qs: {event: 'send', email: params.email}
  //   });
  // }

  // async _onClickInputOpen(input: any, $event: any): Promise<any> {
  //   window.open(`${input.form?.value || input.value}`, `${input.page.target || '_system'}`);
  // }

  // async _onClickInputCopy(input: any, $event: any): Promise<any> {
  //   navigator.clipboard.writeText(`${input.text?.title}: ${document.location.href}`);
  // }

  // async _onClickInputShare(input: any, $event: any): Promise<any> {
  //   navigator.share({title: `${input.text?.title}`, url: `${document.location.href}`});
  // }

  // async _onClickInputColor(input: any, $event: any): Promise<any> {
  //   if (!input.readonly) {
  //     if (!input.$el) {
  //       input.$el = document.createElement('input');
  //       input.$el.type = 'color';
  //       input.$el.onchange = () => {
  //         if (input.$el.value) {
  //           input.setValue(input.$el.value);
  //         }
  //       };
  //       $event.target.parentNode.appendChild(input.$el);
  //     }
  //     setTimeout(() => input.$el.click(), 100);
  //   }
  // }

  // async _onClickInputFiles(input: any, $event: any): Promise<any> {
  //   if (!input.readonly) {
  //     if (!input.$el) {
  //       input.$el = document.createElement('input');
  //       input.$el.type = 'file';
  //       input.$el.accept = input.options?.accept || '*/*'; // ;capture=camera
  //       input.$el.capture = input.options?.capture || 'environment';
  //       input.$el.onchange = () => {
  //         if (input.$el.files && input.$el.files[0]) {
  //           input.setValue(input.$el.files[0]);
  //         }
  //       };
  //       $event.target.parentNode.appendChild(input.$el);
  //     }
  //     setTimeout(() => input.$el.click(), 100);
  //   }
  // }


  // async _onClickValueSearch(page: any, item: any, $event: any): Promise<any> {
  //   //  if (this.modal) {
  //   //    this.page.mode = mode;
  //   //    this.page.params = item;
  //   //    this.page.values = item;
  //   //    this.onInit();
  //   //    return true;
  //   //  }
  //   //  if (this.site.page.auth(`${this.page.view}/${mode}/:_id`)) {
  //   //    this.site.page.goto(`${this.page.view}/${mode}/:_id`, item);
  //   //    return true;
  //   //  }
  //   //  if (this.site.page.auth(`${this.page.view}/${mode}`)) {
  //   //    this.site.page.goto(`${this.page.view}/${mode}`, item);
  //   //    return true;
  //   //  }
  //   //  return false;
  //   if (item) {
  //     if (this.page.onSelectItem) {
  //       page.page.onSelectItem(page, item.value);
  //       return;
  //     }
  //     page.site.page.goto(`${page.config.view}/select/:_id`, item);
  //     return;
  //   }
  //   //if (item && type === 'select') {
  //   //  field.form.setValue(item.index || '');
  //   //  field.query = item.index ? item.title || item.index : '';
  //     //popover.dismiss();
  //   //}
  // }


  //site_background: `#222 url("https://www.flip-b.com/assets/backgrounds/background-${('000' + (Math.floor(Math.random() * 440) + 1)).substr(-3)}.jpg") 0 0/100% 100% no-repeat`,
  //// Define html title
  //const $title: any = document.querySelector('title');
  //if ($title && this.menu.title) {
  //  $title.innerText = this.menu.title;
  //}
  //
  //// Define html color
  //const $color: any = document.querySelector('meta[name=theme-color]');
  //if ($color && this.menu.color) {
  //  $color.setAttribute('content', this.menu.color);
  //}
  //
  //// Define html icons
  //const $icons: any = document.querySelectorAll('link[rel=icon]');
  //if ($icons && this.menu.image) {
  //  [...$icons].map(($icon: any) => $icon.setAttribute('href', this.menu.image));
  //}
  //
  //// Verify html user
  //if (this.user) {
  //  document.body.classList.toggle('user', true);
  //} else {
  //  document.body.classList.toggle('user', false);
  //}

  ///**
  // * Goto
  // */
  //goto(url = '', params: any = {}, options: any = {}): void {
  //  url = this.formatNavigationUrl(url, params);
  //  options.replaceUrl = true;
  //  options.state = params;
  //  this.router.navigate([url], options);
  //}

  ///**
  // * Root
  // */
  //root(url = '', params: any = {}, options: any = {}): void {
  //  url = this.formatNavigationUrl(url, params);
  //  this.history = [];
  //  options.replaceUrl = true;
  //  options.state = params;
  //  this.router.navigate([url], options);
  //}
  //
  ///**
  // * Back
  // */
  //back(url = '', params: any = {}, options: any = {}): void {
  //  url = this.formatNavigationUrl(url || this.history[this.history.length - 2], params);
  //  this.history = this.history.slice(0, -2);
  //  options.replaceUrl = true;
  //  options.state = params;
  //  this.router.navigate([url], options);
  //}
}
