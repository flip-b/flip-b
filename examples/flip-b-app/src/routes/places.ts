import { Route, Routes } from '@flip-b/app';

export default class PlacesRoute extends Route {
  routes: Routes = {
    search: {
      method: 'get',
      path: '/',
      auth: ['administrator', 'supervisor', 'operator', 'user'],
      handler: 'places.search'
    },
    count: {
      method: 'get',
      path: '/count',
      auth: ['administrator', 'supervisor', 'operator', 'user'],
      handler: 'places.count'
    },
    select: {
      method: 'get',
      path: '/:_id',
      auth: ['administrator', 'supervisor', 'operator', 'user'],
      handler: 'places.select'
    },
    create: {
      method: 'post',
      path: '/',
      auth: ['administrator'],
      handler: 'places.update'
    },
    update: {
      method: 'put',
      path: '/:_id',
      auth: ['administrator'],
      handler: 'places.update'
    },
    delete: {
      method: 'delete',
      path: '/:_id',
      auth: ['administrator'],
      handler: 'places.delete'
    }
  };
}
