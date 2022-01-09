import { Bot } from './bot';
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
    if (!bot.config.server) {
      throw new Error(`Server config value is invalid.`);
    }
    if (!bot.config.server.host) {
      throw new Error(`Server config value is invalid, "host" is required.`);
    }
    if (!bot.config.server.port) {
      throw new Error(`Server config value is invalid, "port" is required.`);
    }
    if (!bot.config.router) {
      throw new Error(`Router config value is invalid.`);
    }
    this.bot = bot;
    this.initializeServer();
  }

  /**
   * Initialize server
   */
  private async initializeServer() {
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
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    this.router.use(this.bot.config.router.public.path, express.static(this.bot.config.router.public.dest));
    this.server.listen(this.bot.config.server.port).on('listening', () => {
      console.info(`> listening server on ${this.bot.config.server.host}:${this.bot.config.server.port} (#${process.pid})`);
    });
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
