import express from 'express';

export default function filesHandler(app: any): any {
  if (!app.config.router?.files) {
    return;
  }
  app.config.router.files.path = app.config.router.files.path || '/files';
  app.config.router.files.dest = app.config.router.files.dest || `${app.config.var}/upload/files`;
  app.config.router.files.cache = app.config.router.files.cache || '30 days';
  app.router.use(`${app.config.server.path}${app.config.router.files.path}/`, getHandle(app));
}

function getHandle(app: any): any {
  return express.static(`${app.config.router.files.dest}`, {dotfiles: 'deny', maxAge: `${app.config.router.files.cache}`, etag: false});
}
