import {Bot} from './bot';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import http from 'http';

/**
 * Server
 */
export class Server {
  // Server definitions

  /**
   * Bot
   */
  bot: any;

  /**
   * Router
   */
  router: any;

  /**
   * Server
   */
  server: any;

  /**
   * Constructor
   */
  constructor(bot: Bot) {
    this.bot = bot;
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
    await this.server.listen(this.bot.config.server.port, () => {
      console.info(`! listening server on port ${this.bot.config.server.port} (#${process.pid})`);
    });
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    await this.initialize();
  }
}

export type Request = express.Request;
export type Response = express.Response;
export type Next = express.NextFunction;
