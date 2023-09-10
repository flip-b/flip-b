import express from 'express';
import fs from 'fs';

export default function errorHandler(app: any): any {
  if (!app.config.router?.error) {
    return;
  }
  app.router.use(() => {
    throw new Error('#404 Not Found');
  });
  app.router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const send: any = {status: 500, detail: 'Internal Server Error'};
      const test: any = error.message?.match(/^#([0-9]{3}) (.*)/);
      if (test) {
        send.status = Number(test[1]);
        send.detail = String(test[2]);
      } else {
        console.error(`${error.name}: ${error.message}`);
      }
      const accepts = req.accepts(['image', 'audio', 'video', 'text', 'html', 'json']);
      const isRoute = req.url.startsWith(`${app.config.server.path}${app.config.router.route.path}`);
      const isFiles = req.url.startsWith(`${app.config.server.path}${app.config.router.files.path}`);
      const isMount = req.url.startsWith(`${app.config.server.path}${app.config.router.mount.path}`);
      if (accepts === 'html' && isMount && !isFiles && !isRoute && send.status === 404) {
        const index = `${app.config.router.mount.dest}/index.html`;
        if (fs.existsSync(index)) {
          return res.sendFile(index);
        }
      }
      if (accepts === 'json' || isRoute) {
        res.status(send.status).send({errors: [send]});
      } else {
        res.status(send.status).send(send.detail);
      }
    } catch (error) {
      next(error);
    }
  });
}
