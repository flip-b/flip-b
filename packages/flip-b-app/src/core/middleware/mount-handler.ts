import express from 'express';

export default function mountHandler(app: any): any {
  if (!app.config.router?.mount) {
    return;
  }
  app.config.router.mount.path = app.config.router.mount.path || '';
  app.config.router.mount.dest = app.config.router.mount.dest || `${app.config.var}/public`;
  app.config.router.mount.cache = app.config.router.mount.cache || '30 days';
  app.router.use(`${app.config.server.path}${app.config.router.mount.path}/`, getHandle(app));
}

function getHandle(app: any): any {
  return express.static(`${app.config.router.mount.dest}`, {dotfiles: 'deny', maxAge: `${app.config.router.mount.cache}`, etag: false});
}
