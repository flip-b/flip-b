import {Bot} from './bot';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import http from 'http';

/**
 * Server
 */
export class Server {
  bot: any;
  router: any;
  server: any;

  /**
   * Constructor
   */
  constructor(bot: Bot) {
    this.bot = bot;
    this.initialize();
  }

  /**
   * Initialize
   */
  private async initialize(): Promise<any> {
    this.router = express();
    this.server = http.createServer(this.router);
    this.router.set('trust proxy', true);
    this.router.set('views', this.bot.config.router.render.path);
    this.router.set('view engine', this.bot.config.router.render.type);
    this.router.set('etag', false);
    this.router.set('x-powered-by', false);
    this.router.use(compression(this.bot.config.router.compression));
    this.router.use(cors(this.bot.config.router.cors));
    this.router.use(express.json(this.bot.config.router.json));
    this.router.use(express.urlencoded(this.bot.config.router.urlencoded));
    this.router.use(this.bot.config.router.public.path, express.static(this.bot.config.router.public.dest));
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    console.info(`> listening server on ${this.bot.config.server.host}:${this.bot.config.server.port} (#${process.pid})`);
    this.server.listen(this.bot.config.server.port);
  }

  /**
   * Stop
   */
  async stop(): Promise<any> {
    console.info(`> stopping server`);
  }
}

export interface Request extends express.Request {
  auth: any;
  file: any;
}

export interface Response extends express.Response {
  auth: any;
  file: any;
}

export type Next = express.NextFunction;
export type RequestHandler = express.RequestHandler;
export type ErrorRequestHandler = express.ErrorRequestHandler;

export const Router: any = express.Router;
export const Static: any = express.static;
