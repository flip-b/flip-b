import express from 'express';
import compression from 'compression';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {camelCase} from 'change-case';

import Bull from 'bull';
import {Server as SocketIo} from 'socket.io';
import {createAdapter as socketIoAdapter} from '@socket.io/redis-adapter';
import {Redis} from 'ioredis';

import errorHandler from './middleware/error-handler';
import filesHandler from './middleware/files-handler';
import mountHandler from './middleware/mount-handler';
import routeHandler from './middleware/route-handler';

/**
 * App
 */
export class App {
  // Definitions

  /**
   * Config
   */
  config: any = {};

  /**
   * Helper
   */
  helper: any = {};

  /**
   * Database
   */
  database: any;

  /**
   * Controllers
   */
  controllers: any = {};

  /**
   * Models
   */
  models: any = {};

  /**
   * Routes
   */
  routes: any = {};

  /**
   * Tasks
   */
  tasks: any = {};

  /**
   * Tests
   */
  tests: any = {};

  /**
   * Router
   */
  router: any;

  /**
   * Server
   */
  server: any;

  /**
   * Worker
   */
  worker: any;

  /**
   * Queues
   */
  queues: any;

  /**
   * Memory
   */
  memory: any;

  /**
   * Pub
   */
  pub: any;

  /**
   * Sub
   */
  sub: any;

  /**
   * Socket
   */
  socket: any;

  /**
   * Constructor
   */
  constructor(config: any = {}) {
    const folder = path.dirname((require.main || {}).filename || './src/index.ts');
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
    this.config.router.route = this.config.router.route || {path: '/api'};
    this.config.router.files = this.config.router.files || {path: ''};
    this.config.router.mount = this.config.router.mount || {path: ''};
    this.config.router.error = this.config.router.error || {path: ''};

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
      console.info(`> initializing config`);
      const file = path.resolve(`${this.config.src}/config`);
      const data = await import(file);
      this.config = {...this.config, ...data.default};
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the config module. ${error}`);
    }
  }

  /**
   * Initialize Helper
   */
  private async initializeHelper(): Promise<any> {
    try {
      console.info(`> initializing helper`);
      for (const i of await this.getItems()) {
        this.helper[`${i.name}`] = i.call.default || i.call;
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the helper module. ${error}`);
    }
  }

  /**
   * Initialize Database
   */
  private async initializeDatabase(): Promise<any> {
    try {
      console.info(`> initializing database`);
      this.database = await this.helper.mongoose.connect(`${this.config.mongo.url}`, this.config.mongo.options);
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the database module. ${error}`);
    }
  }

  /**
   * Initialize Controllers
   */
  private async initializeControllers(): Promise<any> {
    try {
      console.info(`> initializing controllers`);
      for (const f of await this.getFiles(path.resolve(`${this.config.src}/controllers`))) {
        this.controllers[`${f.name}`] = new f.call.default(this).getController();
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
      console.info(`> initializing models`);
      for (const f of await this.getFiles(path.resolve(`${this.config.src}/models`))) {
        this.models[`${f.name}`] = new f.call.default(this).getModel();
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
      console.info(`> initializing routes`);
      for (const f of await this.getFiles(path.resolve(`${this.config.src}/routes`))) {
        this.routes[`${f.name}`] = new f.call.default(this).getRoute();
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the routes module. ${error}`);
    }
  }

  /**
   * Initialize Tasks
   */
  private async initializeTasks(): Promise<any> {
    try {
      console.info(`> initializing tasks`);
      for (const f of await this.getFiles(path.resolve(`${this.config.src}/tasks`))) {
        this.tasks[`${f.name}`] = new f.call.default(this).getTask();
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the tasks module. ${error}`);
    }
  }

  /**
   * Initialize Tests
   */
  private async initializeTests(): Promise<any> {
    try {
      console.info(`> initializing tests`);
      for (const f of await this.getFiles(path.resolve(`${this.config.src}/tests`))) {
        this.tests[`${f.name}`] = new f.call.default(this).getTest();
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the tests module. ${error}`);
    }
  }

  /**
   * Initialize Server
   */
  private async initializeServer(): Promise<any> {
    try {
      console.info(`> initializing server`);
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
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the router module. ${error}`);
    }
  }

  /**
   * Initialize Queues
   */
  private async initializeWorker(): Promise<any> {
    try {
      console.info(`> initializing worker`);
      this.worker = {};
      this.worker.queue = new Bull('worker', `${this.config.redis.url}`, {prefix: `${this.config.app}`});
      this.worker.queue.on('failed', (job: any) => job.remove());
      this.worker.queue.on('completed', (job: any) => job.remove());
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the worker module. ${error}`);
    }
  }

  /**
   * Initialize queues
   */
  private async initializeQueues(): Promise<any> {
    try {
      console.info(`> initializing queues`);
      this.queues = {};
      this.queues.queue = new Bull('queues', `${this.config.redis.url}`, {prefix: `${this.config.app}`});
      this.queues.queue.on('failed', (job: any) => job.remove());
      this.queues.queue.on('completed', (job: any) => job.remove());
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the queues module. ${error}`);
    }
  }

  /**
   * Initialize memory
   */
  private async initializeMemory(): Promise<any> {
    try {
      console.info(`> initializing memory`);
      this.memory = new Redis(`${this.config.redis.url}`);
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the memory module. ${error}`);
    }
  }

  /**
   * Initialize pub
   */
  private async initializePub(): Promise<any> {
    try {
      console.info(`> initializing pub`);
      this.pub = new Redis(`${this.config.redis.url}`);
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the pub module. ${error}`);
    }
  }

  /**
   * Initialize sub
   */
  private async initializeSub(): Promise<any> {
    try {
      console.info(`> initializing sub`);
      this.sub = new Redis(`${this.config.redis.url}`);
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the sub module. ${error}`);
    }
  }

  /**
   * Initialize socket
   */
  private async initializeSocket(): Promise<any> {
    try {
      console.info(`> initializing socket`);
      this.socket = new SocketIo(this.server, {path: `${this.config.socket.path}`, transports: ['websocket', 'polling']});
      this.socket.adapter(socketIoAdapter(this.pub, this.sub));
    } catch (error: any) {
      console.warn(`> a critical error occurred while initializing the socket module. ${error}`);
    }
  }

  /**
   * Run task
   */
  private async runTask(args: string[]): Promise<any> {
    try {
      const module = camelCase(args.shift() || '');
      const method = camelCase(args.shift() || '');
      console.info(`> run "${module}.${method}" task`);
      const result: any = await this.tasks[`${module}`][`${method}`](this.helper.yargs(args).argv);
      if (result) {
        console.log(result);
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while runing task. ${error}`);
    }
    await this.stop();
  }

  /**
   * Run test
   */
  private async runTest(args: string[]): Promise<any> {
    try {
      const module = camelCase(args.shift() || '');
      const method = camelCase(args.shift() || '');
      console.info(`> Run "${module}.${method}" test`);
      const result: any = await this.tests[`${module}`][`${method}`](this.helper.yargs(args).argv);
      if (result) {
        console.log(result);
      }
    } catch (error: any) {
      console.warn(`> a critical error occurred while runing test. ${error}`);
    }
    await this.stop();
  }

  /**
   * Get items
   */
  private async getItems(): Promise<any[]> {
    const values: any = ['mongoose', 'express', 'axios', 'bull', 'busboy', 'change-case', 'ejs', 'fs', 'path', 'http', 'https', 'yargs', 'crypto', 'bcryptjs', 'jsonwebtoken', 'mime-types'];
    const result: any[] = [];
    for (const v of values) {
      try {
        result.push({name: camelCase(v), call: await import(v)});
      } catch (error: any) {
        console.error(`${v} ${error}`);
      }
    }
    return result;
  }

  /**
   * Get files
   */
  private async getFiles(base: string): Promise<any[]> {
    if (!fs.existsSync(base)) {
      return [];
    }
    const result: any[] = [];
    const values = fs.readdirSync(base);
    for (const v of values) {
      if (!v.match(/\.(ts|js)$/) || v.match(/\.(d|test|spec)\./)) {
        continue;
      }
      try {
        result.push({name: camelCase(v.split('.')[0]), call: await import(`${base}/${v}`)});
      } catch (error: any) {
        console.error(`${error}`);
      }
    }
    return result;
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    await this.initializeConfig();
    await this.initializeHelper();
    await this.initializeDatabase();
    await this.initializeControllers();
    await this.initializeModels();
    await this.initializeRoutes();
    await this.initializeTasks();
    await this.initializeTests();
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

    // Listen task
    if (process.argv.includes('task')) {
      await this.runTask(process.argv.slice(process.argv.indexOf('task') + 1));
      return;
    }

    // Listen test
    if (process.argv.includes('test')) {
      await this.runTest(process.argv.slice(process.argv.indexOf('test') + 1));
      return;
    }

    // Router
    this.router.use(routeHandler(this));
    this.router.use(filesHandler(this));
    this.router.use(mountHandler(this));
    this.router.use(errorHandler(this));

    // Listen http
    this.server.listen(this.config.server.port, () => {
      console.info(`> listening server on port ${this.config.server.port} (#${process.pid})`);
    });
  }

  /**
   * Stop
   */
  async stop(): Promise<any> {
    try {
      if (this.database) {
        await this.database.disconnect();
      }
      process.exit(0);
    } catch (error: any) {
      console.warn(`> a critical error occurred while stopped the application. ${error}`);
      process.exit(1);
    }
  }

  /**
   * Debug
   */
  async debug(...args: any): Promise<any> {
    if (this.config.env === 'development') {
      console.info(...args);
    }
  }
}
