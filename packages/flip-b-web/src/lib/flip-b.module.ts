import {NgModule, Injector, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Router} from '@angular/router';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {IonicModule} from '@ionic/angular';

import {DataGuard} from './core/data.guard';
import {I18nPipe} from './core/i18n.pipe';
import {FormComponent} from './form/form.component';
import {MenuComponent} from './menu/menu.component';

const CONFIG: any = 'config';
const ROUTER: any = APP_INITIALIZER;

@NgModule({
  declarations: [I18nPipe, FormComponent, MenuComponent],
  imports: [CommonModule, RouterModule, HttpClientModule, IonicModule],
  exports: [CommonModule, RouterModule, HttpClientModule, IonicModule, I18nPipe, FormComponent, MenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FlipBModule {
  static forRoot(flipb: any): ModuleWithProviders<FlipBModule> {
    return {
      ngModule: FlipBModule,
      providers: [
        {provide: CONFIG, useValue: flipb},
        {provide: ROUTER, useFactory: routerFactory, deps: [CONFIG, Injector, HttpClient], multi: true}
      ]
    };
  }
}

function routerFactory(config: any, injector: Injector, http: HttpClient): any {
  return async (): Promise<any> => {
    const flipb: any = await http.get(config.url + '/api/v1/rest/config').toPromise();

    // Define info
    // @param {Object}
    config.info = flipb.info || {};

    // Define user
    // @param {Object}
    config.user = flipb.user || {};

    // Define http
    // @param {Object}
    config.http = {...config.http || {}, ...flipb.http || {}};
    config.http.url = config.http.url || config.url;

    // Define i18n
    // @param {Object}
    config.i18n = {...config.i18n || {}, ...flipb.i18n || {}};
    config.i18n.items = config.i18n.items || {};

    // Define menu
    // @param {Object}
    config.menu = {...config.menu || {}, ...flipb.menu || {}};
    config.menu.title = config.menu.title || '';
    config.menu.label = config.menu.label || '';
    config.menu.image = config.menu.image || '';
    config.menu.items = config.menu.items || [];

    // Define page
    // @param {Object}
    config.page = {...config.page || {}, ...flipb.page || {}};
    config.page.title = config.page.title || '';
    config.page.label = config.page.label || '';
    config.page.image = config.page.image || '';
    config.page.items = config.page.items || [];

    // Define routes
    const routes: any = config.routes || [];
    for (const form of config.page.items || []) {
      form.name = form.name || '';

      // Define view data
      form.path = form.path || '';
      form.menu = form.menu || '';
      form.meta = form.meta || {};
      form.auth = form.auth || Object.keys(form.meta);

      // Define view form
      form.type = form.type || undefined;
      form.rest = form.rest || undefined;
      form.load = form.load || undefined;

      // Define view page
      if (!form.page && form.path) {
        routes.push({
          path: form.path,
          data: form,
          loadComponent: () => import('./view/view.component').then((m) => m.ViewComponent),
          canActivate: [DataGuard]
        });
      }
    }

    // Define router
    const router: Router = injector.get(Router);
    router.resetConfig(routes);
  };
}
