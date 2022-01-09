import { Request, Response, Next } from '../route';

/**
 * Error handler
 */
export default function errorHandler(app: any): any {
  if (!app.config.router?.error) {
    return;
  }
  return (error: any, req: Request, res: Response, next: Next) => {
    try {
      const send: any = { code: 400, data: undefined };
      const test: any = error.message?.match(/^#([0-9]{3}) (.*)/);
      if (test) {
        send.code = Number(test[1]);
        send.data = {
          message: test[2],
          request: req.originalUrl
        };
      } else {
        console.error(error);
      }
      res.status(send.code).send(send.data);
    } catch (error) {
      next(error);
    }
  };
}
