import {DataGuard} from './data.guard';

export function formatConfig(config: any): any {
  config = config || {};

  // Define info
  // @param {Object}
  config.info = config.info || {};

  // Define user
  // @param {Object}
  config.user = config.user || {};

  // Define http
  // @param {Object}
  config.http = config.http || {};

  // Define i18n
  // @param {Object}
  config.i18n = config.i18n || {};

  // Define menu
  // @param {Object}
  config.menu = config.menu || {};

  // Define page
  // @param {Object}
  config.page = config.page || {};

  // Define views
  // @param {Array}
  config.views = config.views || [];

  // Define routes
  // @param {Array}
  config.routes = [];

  // Create views routes
  for (const form of config.views) {
    form.name = form.name || '';

    // Define view data
    form.path = form.path || '';
    form.role = form.role || '';
    form.menu = form.menu || '';
    form.meta = form.meta || {};
    form.auth = form.auth || Object.keys(form.meta);

    // Define view form
    form.type = form.type || undefined;
    form.rest = form.rest || undefined;
    form.load = form.load || undefined;

    // Define view page
    form.page = form.page || (() => import('../view/view.module').then((m) => m.ViewPageModule));

    if (form.path && form.role === 'home') {
      config.routes.push({path: '', pathMatch: 'full', redirectTo: form.path});
    }
    if (form.path) {
      config.routes.push({path: form.path, data: form, loadChildren: form.page, canActivate: [DataGuard]});
    }
  }
  return config;
}
