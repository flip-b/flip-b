import express from 'express';
import compression from 'compression';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {camelCase} from 'change-case';

import mongoose from 'mongoose';

import Bull from 'bull';
import {Server as SocketIo} from 'socket.io';
import {createAdapter as socketIoAdapter} from '@socket.io/redis-adapter';
import {Redis} from 'ioredis';

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

import errorHandler from './middleware/error-handler';
import filesHandler from './middleware/files-handler';
import mountHandler from './middleware/mount-handler';
import routeHandler from './middleware/route-handler';

export class App {
  config: any = {};
  helper: any = {};
  plugin: any = {};
  database: any;
  controllers: any = {};
  models: any = {};
  routes: any = {};
  router: any;
  server: any;
  worker: any;
  queues: any;
  memory: any;
  pub: any;
  sub: any;
  socket: any;

  /**
   * Constructor
   */
  constructor(config: any = {}) {
    const folder: any = path.dirname((require.main || {}).filename || './src/index.ts');
    dotenv.config();

    // Define global options
    this.config = config;
    this.config.app = this.config.app || process.env.NODE_APP || 'app';
    this.config.env = this.config.env || process.env.NODE_ENV || 'development';
    this.config.cwd = this.config.cwd || process.env.NODE_CWD || path.dirname(folder);
    this.config.src = this.config.src || process.env.NODE_SRC || path.resolve(folder);
    this.config.var = this.config.var || process.env.NODE_VAR || path.resolve(this.config.cwd, 'var');
    this.config.tmp = this.config.tmp || process.env.NODE_TMP || path.resolve(this.config.cwd, 'tmp');

    // Define server options
    this.config.server = this.config.server || {};
    this.config.server.path = this.config.server.path || process.env.SERVER_PATH || '';
    this.config.server.port = this.config.server.port || process.env.SERVER_PORT || process.env.PORT || '8080';

    // Define socket options
    this.config.socket = this.config.socket || {};
    this.config.socket.path = this.config.socket.path || process.env.SOCKET_PATH || '';

    // Define router options
    this.config.router = this.config.router || {};
    this.config.router.compression = this.config.router.compression || {};
    this.config.router.cors = this.config.router.cors || {};
    this.config.router.json = this.config.router.json || {};
    this.config.router.urlencoded = this.config.router.urlencoded || {extended: true};
    this.config.router.route = this.config.router.route || undefined;
    this.config.router.files = this.config.router.files || undefined;
    this.config.router.mount = this.config.router.mount || undefined;
    this.config.router.error = this.config.router.error || undefined;

    // Define mongo options
    this.config.mongo = this.config.mongo || {};
    this.config.mongo.url = this.config.mongo.url || process.env.MONGO_URL || undefined;
    this.config.mongo.options = this.config.mongo.options || undefined;

    // Define redis options
    this.config.redis = this.config.redis || {};
    this.config.redis.url = this.config.redis.url || process.env.REDIS_URL || undefined;
    this.config.redis.options = this.config.redis.options || undefined;

    // Define token options
    this.config.token = this.config.token || {};
    this.config.token.expire = this.config.token.expire || process.env.TOKEN_EXPIRE || '1d';
    this.config.token.secret = this.config.token.secret || process.env.TOKEN_SECRET || 's3cr3t@t0k3n';
  }

  /**
   * Initialize Config
   */
  private async initializeConfig(): Promise<any> {
    try {
      for (const f of await this.getFiles(`${this.config.src}/config`)) {
        this.config = {...this.config, ...f.call.default};
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the config module. ${error}`);
    }
  }

  /**
   * Initialize Database
   */
  private async initializeDatabase(): Promise<any> {
    try {
      this.database = await mongoose.connect(`${this.config.mongo.url}`, this.config.mongo.options);
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the database module. ${error}`);
    }
  }

  /**
   * Initialize Controllers
   */
  private async initializeControllers(): Promise<any> {
    try {
      for (const f of await this.getFiles(`${this.config.src}/controllers`)) {
        this.controllers[`${f.name}`] = new f.call.default(this).self;
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the controllers module. ${error}`);
    }
  }

  /**
   * Initialize Models
   */
  private async initializeModels(): Promise<any> {
    try {
      for (const f of await this.getFiles(`${this.config.src}/models`)) {
        this.models[`${f.name}`] = new f.call.default(this).self;
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the models module. ${error}`);
    }
  }

  /**
   * Initialize Routes
   */
  private async initializeRoutes(): Promise<any> {
    try {
      for (const f of await this.getFiles(`${this.config.src}/routes`)) {
        this.routes[`${f.name}`] = new f.call.default(this).self;
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the routes module. ${error}`);
    }
  }

  /**
   * Initialize Server
   */
  private async initializeServer(): Promise<any> {
    try {
      this.router = express();
      this.server = http.createServer(this.router);
      this.router.set('trust proxy', true);
      this.router.set('views', `${this.config.var}/app/views`);
      this.router.set('view engine', 'ejs');
      this.router.set('etag', false);
      this.router.set('x-powered-by', false);
      this.router.use(compression(this.config.router.compression));
      this.router.use(cors(this.config.router.cors));
      this.router.use(express.json(this.config.router.json));
      this.router.use(express.urlencoded(this.config.router.urlencoded));
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the router module. ${error}`);
    }
  }

  /**
   * Initialize Worker
   */
  private async initializeWorker(): Promise<any> {
    try {
      this.worker = {};
      this.worker.events = {};
      this.worker.object = new Bull('worker', `${this.config.redis.url}`, {prefix: `${this.config.app}`});
      this.worker.object.on('failed', (job: any) => job.remove());
      this.worker.object.on('completed', (job: any) => job.remove());
      this.worker.object.process('default', 1, async (job: any, done: any) => {
        await this.worker.events[job.data.name](job).catch(console.error);
        done();
      });
      this.worker.add = async (name: string, call: any) => {
        this.worker.events[name] = call;
        this.worker.job(name);
      };
      this.worker.job = async (name: any) => {
        const job = await this.worker.object.getJob(name);
        if (!job) {
          this.worker.object.add('default', {name}, {jobId: name});
        }
        await this.sleep(5000);
        this.worker.job(name);
      };
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the worker module. ${error}`);
    }
  }

  /**
   * Initialize Queues
   */
  private async initializeQueues(): Promise<any> {
    try {
      this.queues = {};
      this.queues.events = {};
      this.queues.object = new Bull('queues', `${this.config.redis.url}`, {prefix: `${this.config.app}`});
      this.queues.object.on('failed', (job: any) => job.remove());
      this.queues.object.on('completed', (job: any) => job.remove());
      this.queues.object.process('default', 1, async (job: any, done: any) => {
        await this.worker.events[job.data.name](job).catch(console.error);
        done();
      });
      this.queues.add = async (name: string, call: any) => {
        this.worker.events[name] = call;
      };
      this.queues.job = async (name: string, data: any) => {
        await this.queues.object.add('default', {name, data});
      };
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the queues module. ${error}`);
    }
  }

  /**
   * Initialize Memory
   */
  private async initializeMemory(): Promise<any> {
    try {
      this.memory = new Redis(`${this.config.redis.url}`);
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the memory module. ${error}`);
    }
  }

  /**
   * Initialize Pub
   */
  private async initializePub(): Promise<any> {
    try {
      this.pub = new Redis(`${this.config.redis.url}`);
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the pub module. ${error}`);
    }
  }

  /**
   * Initialize Sub
   */
  private async initializeSub(): Promise<any> {
    try {
      this.sub = new Redis(`${this.config.redis.url}`);
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the sub module. ${error}`);
    }
  }

  /**
   * Initialize Socket
   */
  private async initializeSocket(): Promise<any> {
    try {
      this.socket = new SocketIo(this.server, {path: `${this.config.socket.path}`, transports: ['websocket', 'polling']});
      this.socket.adapter(socketIoAdapter(this.pub, this.sub));
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the socket module. ${error}`);
    }
  }

  /**
   * Run
   */
  async run(...a: any[]): Promise<any> {
    try {
      let args: any;
      if (typeof a[0] === 'string') {
        args = {name: a[0], type: a[1], ...(a[2] || {})};
      } else {
        args = a[0] || {};
      }
      const name: any = camelCase(args.name);
      const type: any = camelCase(args.type || 'handle');

      const params: any = {};
      params.auth = {};
      params.body = {...args, data: args._};
      params.info = {name, type};

      delete params.body.name;
      delete params.body.type;
      delete params.body._;
      delete params.body.$0;

      return await this.controllers[name][type](params);
    } catch (error: any) {
      console.warn(`> a critical error occurred while runing task. ${error}`);
    }
  }

  /**
   * Get Files
   */
  async getFiles(base: string): Promise<any[]> {
    if (!fs.existsSync(base)) {
      return [];
    }
    const result: any[] = [];
    const values: any = fs.readdirSync(base);
    for (const v of values) {
      if (!v.match(/\.(ts|js)$/) || v.match(/\.(d|test|spec)\./)) {
        continue;
      }
      result.push({name: camelCase(v.split('.')[0]), call: await import(`${base}/${v}`)});
    }
    return result;
  }

  /**
   * Get Views
   */
  async getViews(base: string): Promise<any[]> {
    if (!fs.existsSync(base)) {
      return [];
    }
    const result: any[] = [];
    const values: any = fs.readdirSync(base);
    for (const v of values) {
      if (!v.match(/\.(ejs)$/)) {
        continue;
      }
      result.push({name: camelCase(v.split('.')[0]), view: fs.readFileSync(`${base}/${v}`).toString()});
    }
    return result;
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    await this.initializeConfig();
    await this.initializeDatabase();
    await this.initializeControllers();
    await this.initializeModels();
    await this.initializeRoutes();
    await this.initializeServer();
    await this.initializeWorker();
    await this.initializeQueues();
    await this.initializeMemory();
    await this.initializePub();
    await this.initializeSub();
    await this.initializeSocket();
  }

  /**
   * Serve
   */
  async serve(): Promise<any> {
    process.on('SIGINT', () => {
      console.info('> sigint received, shutting down');
      this.stop();
    });
    process.on('SIGTERM', () => {
      console.info('> sigterm received, shutting down');
      this.stop();
    });
    process.on('SIGUSR2', () => {
      console.info('> sigusr2 received, shutting down');
      this.stop();
    });

    // Verify task
    const argv: any = yargs(hideBin(process.argv)).argv;
    if (argv.name) {
      const result: any = await this.run(argv);
      if (result) {
        console.info(result);
      }
      await this.stop();
      return;
    }

    // Listen router
    routeHandler(this);
    filesHandler(this);
    mountHandler(this);
    errorHandler(this);

    // Listen server
    this.server.listen(this.config.server.port, () => {
      console.info(`> listening server on port ${this.config.server.port} (#${process.pid})`);
    });
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
   * Sleep
   */
  async sleep(time: number): Promise<any> {
    return await new Promise((resolve) => setTimeout(resolve, time));
  }
}
