import {Injectable} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {LoadingController, AlertController, ModalController, ToastController, MenuController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  // Definitions

  history: any = [];

  loading: any = false;

  /**
   * Constructor
   */
  constructor(
    public router: Router,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public menuController: MenuController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
    this.onInit();
  }

  /**
   * Init event handler
   */
  async onInit(): Promise<any> {
    //this.router.events.subscribe((event: any) => {
    //  if (event instanceof NavigationEnd && event.url) {
    //    this.history.push(event.url);
    //    this.history = this.history.slice(-10);
    //  }
    //});
    ////// Fixed fucking shadow-root
    //setInterval(() => {
    //  const test: any = document.querySelector('ion-datetime');
    //  if (test && test.shadowRoot) {
    //    const el: any = test.shadowRoot.querySelector('.calendar-month-year');
    //    if (el) {
    //      el.style.width = '150px';
    //    }
    //  }
    //}, 500);
  }

  /**
   * onLoadImageError
   */
  async onLoadImageError($event: any): Promise<any> {
    $event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mP8/58BAzAOZUEA5OUT9xiCXfgAAAAASUVORK5CYII=';
  }

  /**
   * Format path
   */
  formatNavigationUrl(url = '', params: any = {}): string {
    for (const p in params) {
      url = url.replace(new RegExp(':' + p), params[p]);
    }
    return url;
  }

  /**
   * Show loading
   */
  async showLoading(params: any = {}): Promise<any> {
    this.hideLoading();

    if (typeof params.$event?.target?.complete === 'function') {
      params.$event.target.complete();
    }

    const loading = (this.loading = `${new Date().getTime()}-${Math.random()}`);
    await new Promise((r) => setTimeout(r, params.delay || 3000));
    if (loading !== this.loading) {
      return;
    }

    if (params.message) {
      const text = params.message; //this.formatI18n(params.message, params.value);
      if (text && text != params.message) {
        params.message = text;
      } else {
        params.message = null;
      }
    }

    if (params.message) {
      const object: any = await this.loadingController.create({cssClass: 'flb', id: 'loading', message: params.message, duration: params.duration || 10000});
      object.present();
    }
  }

  /**
   * Hide loading
   */
  async hideLoading(): Promise<any> {
    this.loading = null;
    this.loadingController.dismiss('loading').catch(() => true);
  }

  /**
   * Show message
   */
  async showMessage(params: any = {}): Promise<any> {
    this.hideLoading();

    if (typeof params.$event?.target?.complete === 'function') {
      params.$event.target.complete();
    }

    if (params.message) {
      const text = params.message; //this.formatI18n(params.message, {...(params.params || {}), ...(params.result || {})});
      if (text && text != params.message) {
        params.message = text;
      } else {
        params.message = null;
      }
    }

    if (params.error) {
      params.message = 'page.status.${params.error?.status' //this.formatI18n(`page.status.${params.error?.status || '500'}.warning`) || params.message;
      params.color = params.color || 'danger';
      params.duration = params.duration || 6000;
    } else {
      params.color = params.color || 'success';
      params.duration = params.duration || 3000;
    }

    if (params.message) {
      const object: any = await this.toastController.create({cssClass: 'flb', message: params.message, color: params.color, duration: params.duration});
      object.present();
    }

    if (params.error) {
      if (params.error.status == 402) {
        console.log('ERROR', params.error?.status);
        //await this.store();
        //this.goto('user/signin');
      }
    }
  }

  /**
   * Show view
   */
  async showView(params: any = {}): Promise<any> {
    await this.hideLoading();
    if (typeof params.$event?.target?.complete === 'function') {
      params.$event.target.complete();
    }
    const modal = await this.modalController.create({cssClass: 'flb', component: params.component, componentProps: params.componentProps});
    await modal.present();
    const result: any = await modal.onDidDismiss();
    if (result && result.data) {
      return result.data;
    } else {
      return null;
    }
  }
}
