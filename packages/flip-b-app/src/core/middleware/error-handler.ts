import express from 'express';

/**
 * Error handler
 */
export default function errorHandler(app: any): any {
  if (!app.config.router?.error) {
    return;
  }
  return getPathHandler();
}

/**
 * Get path handler
 */
function getPathHandler(): any {
  return (error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const send: any = {code: 500, data: undefined};
      const test: any = error.message?.match(/^#([0-9]{3}) (.*)/);
      if (test) {
        send.code = Number(test[1]);
        send.data = {message: test[2], url: req.originalUrl};
      } else {
        console.error(error);
      }
      res.status(send.code).send(send.data);
    } catch (error) {
      next(error);
    }
  };
}
