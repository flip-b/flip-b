import { Route, Routes } from '@flip-b/app';

export default class AccountsRoute extends Route {
  routes: Routes = {
    search: {
      method: 'get',
      path: '/',
      auth: ['administrator', 'supervisor', 'operator', 'user'],
      handler: 'accounts.search'
    },
    count: {
      method: 'get',
      path: '/count',
      auth: ['administrator', 'supervisor', 'operator', 'user'],
      handler: 'accounts.count'
    },
    select: {
      method: 'get',
      path: '/:_id',
      auth: ['administrator', 'supervisor', 'operator', 'user'],
      handler: 'accounts.select'
    },
    create: {
      method: 'post',
      path: '/',
      auth: ['administrator'],
      handler: 'accounts.update'
    },
    update: {
      method: 'put',
      path: '/:_id',
      auth: ['administrator'],
      handler: 'accounts.update'
    },
    delete: {
      method: 'delete',
      path: '/:_id',
      auth: ['administrator'],
      handler: 'accounts.delete'
    }
  };
}
