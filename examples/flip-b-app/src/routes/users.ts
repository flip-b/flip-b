import { Route, Routes } from '@flip-b/app';

export default class UsersRoute extends Route {
  routes: Routes = {
    search: {
      method: 'get',
      path: '/',
      auth: ['administrator', 'supervisor'],
      handler: 'users.search'
    },
    count: {
      method: 'get',
      path: '/count',
      auth: ['administrator', 'supervisor'],
      handler: 'users.count'
    },
    select: {
      method: 'get',
      path: '/:_id',
      auth: ['administrator', 'supervisor'],
      handler: 'users.select'
    },
    create: {
      method: 'post',
      path: '/',
      auth: ['administrator', 'supervisor'],
      handler: 'users.update'
    },
    update: {
      method: 'put',
      path: '/:_id',
      auth: ['administrator', 'supervisor'],
      handler: 'users.update'
    },
    delete: {
      method: 'delete',
      path: '/:_id',
      auth: ['administrator'],
      handler: 'users.delete'
    },
    profile: {
      method: 'post',
      path: '/profile',
      auth: ['administrator', 'supervisor', 'operator', 'user'],
      handler: 'users.profile'
    },
    signout: {
      method: 'post',
      path: '/signout',
      auth: ['administrator', 'supervisor', 'operator', 'user'],
      handler: 'users.signout'
    },
    signin: {
      method: 'post',
      path: '/signin',
      auth: ['anonymous'],
      handler: 'users.signin'
    },
    signup: {
      method: 'post',
      path: '/signup',
      auth: ['anonymous'],
      handler: 'users.signup'
    },
    forgot: {
      method: 'post',
      path: '/forgot',
      auth: ['anonymous'],
      handler: 'users.forgot'
    },
    verify: {
      method: 'post',
      path: '/verify',
      auth: ['anonymous'],
      handler: 'users.verify'
    }
  };
}
