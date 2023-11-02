import {NgModule, Injector, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Router} from '@angular/router';
import {HttpClientModule, HttpClientJsonpModule, HttpClient} from '@angular/common/http';
import {IonicModule} from '@ionic/angular';

import {DataGuard} from './core/data.guard';
import {I18nPipe} from './core/i18n.pipe';
import {FormComponent} from './form/form.component';
import {MenuComponent} from './menu/menu.component';

const CONFIG: any = 'config';
const ROUTER: any = APP_INITIALIZER;

@NgModule({
  declarations: [I18nPipe, FormComponent, MenuComponent],
  imports: [CommonModule, RouterModule, HttpClientModule, HttpClientJsonpModule, IonicModule],
  exports: [CommonModule, RouterModule, HttpClientModule, HttpClientJsonpModule, IonicModule, I18nPipe, FormComponent, MenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FlipBModule {
  static forRoot(config: any): ModuleWithProviders<FlipBModule> {
    return {
      ngModule: FlipBModule,
      providers: [
        {provide: CONFIG, useValue: config},
        {provide: ROUTER, useFactory: routerFactory, deps: [CONFIG, Injector, HttpClient], multi: true}
      ]
    };
  }
}

declare global {
  interface Window {
    libs: any;
    form: any;
  }
}

declare const window: any;

function routerFactory(config: any, injector: Injector, http: HttpClient): any {
  return async (): Promise<any> => {
    config.app = config.app || 'flip-b';
    config.url = config.url || '';
    config.uri = config.uri || '';
    config.headers = config.headers || {};

    const flipb: any = await http.get(`${config.url}/api/v1/rest/settings`).toPromise();

    config.i18n = {...(config.i18n || {}), ...(flipb.i18n || {})};
    config.i18n.config = config.i18n.config || {};
    config.i18n.values = config.i18n.values || {};

    config.menu = {...(config.menu || {}), ...(flipb.menu || {})};
    config.menu.config = config.menu.config || {};
    config.menu.values = config.menu.values || [];

    config.page = {...(config.page || {}), ...(flipb.page || {})};
    config.page.config = config.page.config || {};
    config.page.values = config.page.values || [];

    config.libs = [...(config.libs || []), ...(flipb.libs || [])];

    const routes: any = config.routes || [];
    for (const form of config.page.values || []) {
      form.name = form.name || '';
      form.path = form.path || undefined;
      form.type = form.type || undefined;
      form.rest = form.rest || undefined;
      form.meta = form.meta || {};
      form.auth = form.auth || Object.keys(form.meta);

      if (form.path && !form.page) {
        routes.push({
          path: form.path,
          data: form,
          loadComponent: () => import('./view/view.component').then((m) => m.ViewComponent),
          canActivate: [DataGuard]
        });
      }
    }
    console.log(routes);

    const router: Router = injector.get(Router);
    router.resetConfig(routes);

    for (const lib of config.libs) {
      await http
        .jsonp(lib.url, 'callback')
        .toPromise()
        .catch(() => true);
      window.libs = window.libs || {};
      window.libs[lib.key] = window[lib.key];
    }
  };
}
