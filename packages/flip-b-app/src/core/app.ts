import express from 'express';
import compression from 'compression';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {camelCase} from 'change-case';
import errorHandler from './middleware/error-handler';
import filesHandler from './middleware/files-handler';
import mountHandler from './middleware/mount-handler';
import routeHandler from './middleware/route-handler';

/**
 * App
 */
export class App {
  config: any;
  router: any;
  server: any;
  database: any;
  helper: any = {};
  controllers: any = {};
  models: any = {};
  routes: any = {};
  tasks: any = {};

  /**
   * Constructor
   */
  constructor(config: any = {}) {
    const folder = path.dirname((require.main || {}).filename || './src/index.ts');
    dotenv.config();
    config.env = config.env || process.env.NODE_ENV || 'development';
    config.cwd = config.cwd || process.env.NODE_CWD || path.dirname(folder);
    config.src = config.src || process.env.NODE_SRC || path.resolve(folder);
    config.var = config.var || process.env.NODE_VAR || path.resolve(config.cwd, 'var');
    config.tmp = config.tmp || process.env.NODE_TMP || path.resolve(config.cwd, 'tmp');
    this.config = config;
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    await this.initializeConfig();
    await this.initializeDatabase();
    await this.initializeHelper();
    await this.initializeControllers();
    await this.initializeModels();
    await this.initializeRoutes();
    await this.initializeTasks();
    await this.initializeRouter();
    await this.initializeServer();
  }

  /**
   * Stop
   */
  async stop(): Promise<any> {
    if (this.database) {
      await this.database.disconnect();
    }
    process.exit(0);
  }

  /**
   * Debug
   */
  async debug(...args: any): Promise<any> {
    if (this.config.env === 'development') {
      console.info(...args);
    }
  }

  /**
   * Initialize config
   */
  private async initializeConfig(): Promise<any> {
    this.debug(`> initializing config`);
    const file = path.resolve(`${this.config.src}/config/${this.config.env.toLowerCase()}`);
    const data = await import(file);
    this.config = {...this.config, ...data.default};
  }

  /**
   * Initialize database
   */
  private async initializeDatabase(): Promise<any> {
    this.debug(`> initializing database`);
    if (this.config.database) {
      this.database = await mongoose.connect(`${this.config.database.url}`, this.config.database.options);
    }
  }

  /**
   * Initialize helper
   */
  private async initializeHelper(): Promise<any> {
    this.debug(`> initializing helper`);
    const list = ['bcryptjs', 'busboy', 'change-case', 'crypto', 'ejs', 'fs', 'path', 'http', 'https', 'jsonwebtoken', 'mime-types'];
    for (const l of list) {
      const helper = await import(`${l}`);
      this.helper[`${camelCase(l)}`] = helper.default || helper;
    }
  }

  /**
   * Initialize controllers
   */
  private async initializeControllers(): Promise<any> {
    this.debug(`> initializing controllers`);
    const files: any[] = await this.getFiles(path.resolve(`${this.config.src}/controllers`));
    for (const f of files) {
      this.controllers[`${f.name}`] = new f.call.default(this).getController();
    }
  }

  /**
   * Initialize models
   */
  private async initializeModels(): Promise<any> {
    this.debug(`> initializing models`);
    const files: any[] = await this.getFiles(path.resolve(`${this.config.src}/models`));
    for (const f of files) {
      this.models[`${f.name}`] = new f.call.default(this).getModel();
    }
  }

  /**
   * Initialize routes
   */
  private async initializeRoutes(): Promise<any> {
    this.debug(`> initializing routes`);
    const files: any[] = await this.getFiles(path.resolve(`${this.config.src}/routes`));
    for (const f of files) {
      this.routes[`${f.name}`] = new f.call.default(this).getRoute();
    }
  }

  /**
   * Initialize tasks
   */
  private async initializeTasks(): Promise<any> {
    this.debug(`> initializing tasks`);
    const files: any[] = await this.getFiles(path.resolve(`${this.config.src}/tasks`));
    for (const f of files) {
      this.tasks[`${f.name}`] = new f.call.default(this).getTask();
    }
  }

  /**
   * Initialize router
   */
  private async initializeRouter(): Promise<any> {
    this.debug(`> initializing router`);
    this.router = express();
    this.server = http.createServer(this.router);

    this.router.set('trust proxy', true);
    this.router.set('views', `${this.config.var}/views`);
    this.router.set('view engine', 'ejs');
    this.router.set('etag', false);
    this.router.set('x-powered-by', false);

    this.router.use(compression(this.config.router.compression));
    this.router.use(cors(this.config.router.cors));
    this.router.use(express.json(this.config.router.json));
    this.router.use(express.urlencoded(this.config.router.urlencoded));

    this.router.use(routeHandler(this));
    this.router.use(filesHandler(this));
    this.router.use(mountHandler(this));
    this.router.use(errorHandler(this));
  }

  /**
   * Initialize server
   */
  private async initializeServer(): Promise<any> {
    if (process.argv.includes('task')) {
      await this.runTask(process.argv.slice(process.argv.indexOf('task') + 1));
      return;
    }
    if (process.argv.includes('test')) {
      await this.runTest(process.argv.slice(process.argv.indexOf('test') + 1));
      return;
    }
    process.on('SIGINT', () => {
      this.debug('> sigint received, shutting down');
      this.stop();
    });
    process.on('SIGTERM', () => {
      this.debug('> sigterm received, shutting down');
      this.stop();
    });
    this.debug(`> initializing server`);
    this.server.listen(this.config.server?.port).on('listening', () => {
      this.debug(`> listening server on port ${this.config.server.port} (#${process.pid})`);
    });
  }

  /**
   * Run task
   */
  private async runTask(args: string[]): Promise<any> {
    const task = camelCase(args.shift() || '');
    this.debug(`> initializing ${task}`);
    await this.tasks[`${task}`].run(...args);
    await this.stop();
  }

  /**
   * Run test
   */
  private async runTest(args: string[]): Promise<any> {
    const test = camelCase(args.shift() || '');
    this.debug(`> initializing ${test}`);
    await this.stop();
  }

  /**
   * Get files
   */
  private async getFiles(base: string): Promise<any[]> {
    const result: any[] = [];
    if (fs.existsSync(base)) {
      const files = fs.readdirSync(`${base}`);
      for (const f of files) {
        if (f.match(/\.(ts|js)$/) && !f.match(/\.(d|test|spec)\./)) {
          result.push({
            name: camelCase(`${f}`.split('.')[0]),
            call: await import(`${base}/${f}`)
          });
        }
      }
    }
    return result;
  }
}
