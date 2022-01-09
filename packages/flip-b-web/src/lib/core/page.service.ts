import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController, ModalController, ToastController, MenuController } from '@ionic/angular';
import { HttpService } from './http.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  config: any;
  i18n: any;
  user: any;
  data: any = {};
  menu: any = [];
  dark: any = false;
  loading: any = null;

  constructor(
    public router: Router,
    public navController: NavController,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public toastController: ToastController,
    public menuController: MenuController,
    public httpService: HttpService,
    public configService: ConfigService
  ) {
    this.config = configService.values;

    // Define user and menu from auth service
    this.httpService.getValueAsObservable().subscribe((result) => {
      this.user = result || null;

      // Define i18n
      this.i18n = {};
      for (const p of this.config.pages) {
        if (p.config && p.config.name && p.config.i18n && p.config.i18n[this.config.language]) {
          this.i18n[p.config.name] = p.config.i18n[this.config.language];
        }
      }

      // Define menu
      this.menu = [];
      for (const page of this.config.pages) {
        for (const route of page.routes) {
          if (route.path && route.menu && route.auth && route.auth.includes((this.user || {}).access || 'anonymous')) {
            this.menu.push(route);
          }
        }
      }

      this.config.title = (this.user?.place?.name || this.config.name || '').split(', ').pop();

      if (this.user?.place?.locale?.language) {
        this.config.language = this.user.place.locale.language;
      }
      if (this.user?.place?.locale?.country) {
        this.config.country = this.user.place.locale.country;
      }
      if (this.user?.place?.locale?.currency) {
        this.config.currency = this.user.place.locale.currency;
      }

      // Remove theme
      document.body.classList.toggle('dark', false);
      document.body.classList.toggle('light', false);
      document.body.classList.toggle('other', false);

      // Define theme
      if (this.dark) {
        document.body.classList.toggle('dark', true);
      } else if (this.user?.place?.config?.theme) {
        document.body.classList.toggle(this.user.place.config.theme, true);
      } else if (this.config.theme) {
        document.body.classList.toggle(this.config.theme, true);
      }

      // Define color
      if (this.user?.place?.config?.color) {
        document.documentElement.style.setProperty('--app-color', `${this.user.place.config.color}`);
      } else if (this.config.color) {
        document.documentElement.style.setProperty('--app-color', `${this.config.color}`);
      } else {
        document.documentElement.style.setProperty('--app-color', '');
      }

      // Define color contrast
      if (this.user?.place?.config?.color_contrast) {
        document.documentElement.style.setProperty('--app-color-contrast', `${this.user.place.config.color_contrast}`);
      } else if (this.config.color_contrast) {
        document.documentElement.style.setProperty('--app-color-contrast', `${this.config.color_contrast}`);
      } else {
        document.documentElement.style.setProperty('--app-color-contrast', '');
      }

      // Define image
      if (this.user?.place?.config?.image) {
        document.documentElement.style.setProperty('--app-image', `url("${this.user.place.config.image}") 0 0/100% 100% no-repeat`);
      } else if (this.config.image) {
        document.documentElement.style.setProperty('--app-image', `url("${this.config.image}") 0 0/100% 100% no-repeat`);
      } else {
        document.documentElement.style.setProperty('--app-image', '');
      }

      // Define theme color
      const color = window.getComputedStyle(document.body).getPropertyValue('--app-color').trim();
      if (color) {
        const q = document.querySelector('meta[name=theme-color]');
        if (q) {
          q.setAttribute('content', color);
        }
      }
      if (this.config.title) {
        const q = document.querySelector('title');
        if (q) {
          q.innerText = this.config.title;
        }
      }
      if (this.user) {
        document.body.classList.toggle('user', true);
      } else {
        document.body.classList.toggle('user', false);
      }
    });

    // Define title from route
    this.router.events.subscribe((result: any) => {
      if (result && result.constructor && result.constructor.name == 'NavigationEnd') {
        for (const page of this.config.pages) {
          for (const route of page.routes) {
            if (result.url.match(new RegExp('^/' + route.path.replace(/\/\:([^\/]+)/g, '/([^/]+)') + '$'))) {
              const q = document.querySelector('title');
              if (q) {
                if (route.name && route.name != 'home.home') {
                  q.innerText = this.formatI18n(route.name);
                } else {
                  q.innerText = this.config.title;
                }
              }
              return;
            }
          }
        }
      }
    });
  }

  /*
   * Auth methods
   */

  authPage(url: string): boolean {
    for (const page of this.config.pages) {
      for (const route of page.routes) {
        if (route.path && route.path == url && route.auth && route.auth.includes((this.user || {}).access || 'anonymous')) {
          return true;
        }
      }
    }
    return false;
  }

  authRole(inf: string): boolean {
    return inf.split(',').includes(this.user?.access);
  }

  /*
   * Goto methods
   */

  gotoPage(url: string, params: any = {}, options: any = {}) {
    for (const p in params) {
      url = url.replace(new RegExp(':' + p), params[p]);
    }
    options.state = params || {};
    this.navController.navigateForward(url, options);
  }

  gotoRoot(url: string, params: any = {}, options: any = {}) {
    for (const p in params) {
      url = url.replace(new RegExp(':' + p), params[p]);
    }
    options.state = params || {};
    this.navController.navigateRoot(url, options);
  }

  gotoBack() {
    this.navController.back();
  }

  /*
   * Loading methods
   */

  async showLoading(message: any = {}, options: any = null) {
    return await this.loadLoading(
      message,
      options || {
        loading: {
          message: 'home.show_loading',
          delay: 1500,
          duration: 10000
        }
      }
    );
  }

  async showLoadingOnSearch(message: any = {}) {
    return await this.loadLoading(message, {
      loading: {
        message: 'home.show_loading_on_search',
        delay: 3000,
        duration: 10000
      }
    });
  }

  async showLoadingOnSelect(message: any = {}) {
    return await this.loadLoading(message, {
      loading: {
        message: 'home.show_loading_on_select',
        delay: 1500,
        duration: 10000
      }
    });
  }

  async showLoadingOnCreate(message: any = {}) {
    return await this.loadLoading(message, {
      loading: {
        message: 'home.show_loading_on_create',
        delay: 1500,
        duration: 10000
      }
    });
  }

  async showLoadingOnUpdate(message: any = {}) {
    return await this.loadLoading(message, {
      loading: {
        message: 'home.show_loading_on_update',
        delay: 1500,
        duration: 10000
      }
    });
  }

  async showLoadingOnDelete(message: any = {}) {
    return await this.loadLoading(message, {
      loading: {
        message: 'home.show_loading_on_delete',
        delay: 1000,
        duration: 10000
      }
    });
  }

  async loadLoading(message: any = {}, options: any = {}) {
    await this.hideLoading();
    message = { ...(options.loading || {}), ...message };
    const time = (this.loading = new Date().getTime());
    if (message.delay) {
      await new Promise((r) => setTimeout(r, message.delay));
      if (time != this.loading) {
        return;
      }
    }
    if (message.message) {
      const text = this.formatI18n(message.message, message.value);
      if (text && text != message.message) {
        message.message = text;
      } else {
        message.message = null;
      }
    }
    if (message.message) {
      await (
        await this.loadingController.create({
          id: 'loading',
          message: message.message,
          duration: message.duration
        })
      ).present();
    }
  }

  async hideLoading() {
    try {
      this.loading = null;
      await this.loadingController.dismiss('loading');
    } catch (error) {}
  }

  /*
   * Message methods
   */

  async showMessage(message: any = {}, options: any = null) {
    return await this.loadMessage(
      message,
      options || {
        success: {
          message: 'home.show_success',
          color: 'dark',
          duration: 2000
        },
        warning: {
          message: 'home.show_warning',
          color: 'danger',
          duration: 6000
        }
      }
    );
  }

  async showMessageOnSearch(message: any = {}) {
    return await this.loadMessage(message, {
      success: {
        message: 'home.show_success_on_search',
        color: 'success',
        duration: 2000
      },
      warning: {
        message: 'home.show_warning_on_search',
        color: 'danger',
        duration: 6000
      }
    });
  }

  async showMessageOnSelect(message: any = {}) {
    return await this.loadMessage(message, {
      success: {
        message: 'home.show_success_on_select',
        color: 'success',
        duration: 2000
      },
      warning: {
        message: 'home.show_warning_on_select',
        color: 'danger',
        duration: 6000
      }
    });
  }

  async showMessageOnCreate(message: any = {}) {
    return await this.loadMessage(message, {
      success: {
        message: 'home.show_success_on_create',
        color: 'success',
        duration: 2000
      },
      warning: {
        message: 'home.show_warning_on_create',
        color: 'danger',
        duration: 6000
      }
    });
  }

  async showMessageOnUpdate(message: any = {}) {
    return await this.loadMessage(message, {
      success: {
        message: 'home.show_success_on_update',
        color: 'success',
        duration: 2000
      },
      warning: {
        message: 'home.show_warning_on_update',
        color: 'danger',
        duration: 6000
      }
    });
  }

  async showMessageOnDelete(message: any = {}) {
    return await this.loadMessage(message, {
      success: {
        message: 'home.show_success_on_delete',
        color: 'success',
        duration: 2000
      },
      warning: {
        message: 'home.show_warning_on_delete',
        color: 'danger',
        duration: 6000
      }
    });
  }

  async loadMessage(message: any = {}, options: any = {}) {
    await this.hideLoading();
    if (message.event?.target?.complete) {
      message.event.target.complete();
    }
    if (message.error) {
      message = { ...(options.warning || {}), ...message };
    } else {
      message = { ...(options.success || {}), ...message };
    }
    if (message.error?.status >= 400) {
      message.message = `home.show_message_status_${message.error.status}`;
    }
    if (message.error?.status == 402) {
      await this.httpService.removeValue();
      this.gotoRoot('user/signin');
    }
    if (message.message) {
      const text = this.formatI18n(message.message, message.value);
      if (text && text != message.message) {
        message.message = text;
      } else {
        message.message = null;
      }
    }
    if (message.message) {
      await (
        await this.toastController.create({
          cssClass: 'view',
          message: message.message,
          color: message.color,
          duration: message.duration
        })
      ).present();
    }
  }

  /*
   * File methods
   */

  async showFile(params: any): Promise<any> {
    if ((params.item && !params.item[params.name]) || (params.form && !params.form.value[params.name])) {
      await this.showFileUpload(params);
    } else {
      await this.showFileRemove(params);
    }
  }

  async showFileUpload(params: any): Promise<any> {
    const element = document.createElement('input');
    if (params.type == 'image') {
      element.accept = 'image/*;capture=camera';
    } else {
      element.accept = params.type || '*/*';
    }
    element.type = 'file';
    element.onchange = () => {
      if (element.files) {
        this.showFileUpdate(params, element.files[0]);
      }
    };
    element.click();
  }

  async showFileUpdate(params: any, file: any = null): Promise<any> {
    const body = new FormData();
    body.append('upload', file);
    const result = await this.httpService.requestReportProgress({
      method: 'POST',
      uri: '/api/v1/upload',
      body: body
    });
    if (!result || !result.data || !result.data.url) {
      return;
    }
    if (params.name && params.data?.sendUpdate) {
      await params.data.sendUpdate({
        [params.name]: result.data.url,
        _id: params.item._id
      });
    }
    if (params.name && params.data?.profile) {
      await params.data.profile({ [params.name]: result.data.url });
    }
    if (params.name && params.item) {
      params.item[params.name] = result.data.url;
    }
    if (params.name && params.form) {
      params.form.patchValue({ [params.name]: result.data.url });
    }
  }

  async showFileRemove(params: any): Promise<any> {
    if (params.name && params.data?.sendUpdate) {
      await params.data.sendUpdate({
        [params.name]: null,
        _id: params.item._id
      });
    }
    if (params.name && params.data?.profile) {
      await params.data.profile({ [params.name]: null });
    }
    if (params.name && params.item) {
      params.item[params.name] = null;
    }
    if (params.name && params.form) {
      params.form.patchValue({ [params.name]: null });
    }
  }

  /*
   * Blob methods
   */

  async showBlobAsFile(params: any): Promise<any> {
    const blob = new Blob([params.data], { type: params.type });
    const elem = document.createElement('a');
    elem.href = URL.createObjectURL(blob);
    elem.style.display = 'none';
    elem.download = `${params.name}`;
    elem.click();
  }

  async showBlobAsHtml(params: any): Promise<any> {
    const blob = new Blob([params.data], { type: params.type });
    const elem = document.createElement('iframe');
    elem.src = URL.createObjectURL(blob);
    elem.style.display = 'none';
    elem.onload = () => {
      elem.focus();
      elem.contentWindow?.print();
    };
    document.body.appendChild(elem);
  }

  /**
   * Locale methods
   */

  getLocale(): any {
    return `${this.config.language.toLowerCase()}-${this.config.country.toUpperCase()}`;
  }

  /**
   * Date methods
   */
  getDate(value: any): any {
    const date = new Date(value);
    const p = (n: any) => {
      const v = Math.floor(Math.abs(n));
      return (v < 10 ? '0' : '') + v;
    };
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
   * Number methods
   */

  getNumber(value: any): any {
    let result = value || 0;
    result = parseFloat(result);
    return result;
  }

  getNumberPositive(value: any): any {
    let result = value || 0;
    result = this.getNumber(result);
    result = Math.abs(result);
    return result;
  }

  getNumberNegative(value: any): any {
    let result = value || 0;
    result = this.getNumber(result);
    result = Math.abs(result) * -1;
    return result;
  }

  /**
   * Format methods
   */

  formatI18n(data: any, item: any = null): any {
    const parts = data.toLowerCase().split('.');
    const index = parts.shift();
    const value = parts.join('.');
    let result = '';
    if (this.i18n[`${index}`] && this.i18n[`${index}`][`${value}[${this.config.country}]`]) {
      result = this.i18n[`${index}`][`${value}[${this.config.country}]`];
    } else if (this.i18n[`${index}`] && this.i18n[`${index}`][`${value}`]) {
      result = this.i18n[`${index}`][`${value}`];
    }
    result = result.toString();
    result = result.replace(/\s\s+/, ' ').trim();
    if (item) {
      for (const i in item) {
        result = result.replace(`{{${i}}}`, item[i]);
      }
    }
    result = result.replace(/\s\s+/, ' ').trim();
    return result;
  }

  formatText(text: any, type: any = null): any {
    let result = text || '';
    if (!type) {
      result = this.transformText(result);
    } else if (type == 'number') {
      result = this.formatNumber(result);
    } else if (type == 'decimal') {
      result = this.formatNumber(result);
    } else if (type == 'integer') {
      result = this.formatNumber(result).split(',').shift();
    } else if (type == 'date') {
      result = this.formatDate(result);
    } else if (type == 'datetime') {
      result = this.formatDatetime(result);
    } else if (type == 'time') {
      result = this.formatTime(result);
    } else if (type == 'year-month') {
      result = this.formatYearMonth(result);
    } else if (type == 'link') {
      result = this.formatLink(result);
    } else if (type == 'color') {
      result = this.formatColor(result);
    } else if (type == 'email') {
      result = this.formatEmail(result);
    } else if (type == 'phone') {
      result = this.formatPhone(result);
    } else if (type == 'address') {
      result = this.formatAddress(result);
    }
    result = result.trim();
    return result;
  }

  formatNumber(value: any): any {
    let result = this.getNumber(value);
    result = Math.round((result + Number.EPSILON) * 100) / 100;
    const values = result.toString().split('.');
    result = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + ((values[1] ? values[1].substr(0, 2) : '') + '00').substr(0, 2);
    result = result.trim();
    return result;
  }

  formatDate(value: any): any {
    let result = value || '';
    result = result.toString();
    result = new Date(value).toLocaleDateString(this.getLocale());
    result = result.trim();
    return result;
  }

  formatDatetime(value: any): any {
    let result = value || '';
    result = result.toString();
    result = new Date(value).toLocaleDateString(this.getLocale()) + ' ' + new Date(value).toLocaleTimeString(this.getLocale());
    result = result.trim();
    return result;
  }

  formatTime(value: any): any {
    let result = value || '';
    result = result.toString();
    result = new Date(value).toLocaleTimeString(this.getLocale());
    result = result.trim();
    return result;
  }

  formatYearMonth(value: any): any {
    let result = value || '';
    result = result.toString();
    result = value.replace(/([0-9]{4})-([0-9]{2})/, '$2/$1');
    result = result.trim();
    return result;
  }

  formatLink(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.toLowerCase();
    result = result.trim();
    return result;
  }

  formatColor(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.toLowerCase();
    result = result.trim();
    return result;
  }

  formatEmail(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.toLowerCase();
    result = result.trim();
    return result;
  }

  formatPhone(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.toLowerCase();
    result = result.trim();
    return result;
  }

  formatAddress(value: any): any {
    if (typeof value == 'object' && value) {
      value = [this.formatText(value.street), this.formatText(value.city), this.formatText(value.state)]
        .filter((v) => {
          return !!v;
        })
        .join(', ');
    }
    let result = value || '';
    result = result.toString();
    result = result.trim();
    return result;
  }

  /**
   * Transform methods
   */

  transformText(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.replace(/\s\s+/, ' ').trim();
    result = ` ${result} `.replace(/ a /gi, ' a ').trim();
    result = ` ${result} `.replace(/ y /gi, ' y ').trim();
    result = ` ${result} `.replace(/ o /gi, ' o ').trim();
    result = ` ${result} `.replace(/ x /gi, ' x ').trim();
    result = ` ${result} `.replace(/ de /gi, ' de ').trim();
    result = ` ${result} `.replace(/ en /gi, ' en ').trim();
    result = ` ${result} `.replace(/ con /gi, ' con ').trim();
    result = ` ${result} `.replace(/ sin /gi, ' sin ').trim();
    result = ` ${result} `.replace(/ para /gi, ' para ').trim();
    result = result.charAt(0).toUpperCase() + result.slice(1);

    const document = result.replace(/[^0-9]/g, '');
    if (document && document.length == 11) {
      result = document.replace(/([0-9]{2})([0-9]{8})([0-9]{1})/, '$1-$2-$3');
    }
    return result;
  }
}
