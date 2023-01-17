import express from 'express';
import compression from 'compression';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {camelCase, paramCase} from 'change-case';
import {Plugin} from './plugin';
import {Message} from './message';

/**
 * Bot
 */
export class Bot {
  // Bot definitions

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
   * Plugins
   */
  private plugins: {[key: string]: Plugin} = {};

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

    // Define router eventr options
    this.config.router = this.config.router || {};
    this.config.router.compression = this.config.router.compression || {};
    this.config.router.cors = this.config.router.cors || {};
    this.config.router.json = this.config.router.json || {};
    this.config.router.urlencoded = this.config.router.urlencoded || {extended: true};

    // Define server options
    this.config.server = this.config.server || {};
    this.config.server.host = this.config.server.host || process.env.SERVER_HOST || process.env.HOST || '0.0.0.0';
    this.config.server.port = this.config.server.port || process.env.SERVER_PORT || process.env.PORT || '8080';

    // Define redis options
    this.config.redis = this.config.redis || {};
    this.config.redis.url = this.config.redis.url || process.env.REDIS_URL || `redis://${this.config.server.host}:6379`;

    // Define mongo options
    this.config.mongo = this.config.mongo || {};
    this.config.mongo.url = this.config.mongo.url || process.env.MONGO_URL || `mongodb://root:toor@${this.config.server.host}:27017/${this.config.app}?authSource=admin`;

    // Define token options
    this.config.token = this.config.token || {};
    this.config.token.expire = this.config.token.expire || process.env.TOKEN_EXPIRE || '1d';
    this.config.token.secret = this.config.token.secret || process.env.TOKEN_SECRET || 's3cr3t@t0k3n';

    // Define plugins
    this.config.plugins = this.config.plugins || {};

    // Define origins
    this.config.origins = this.config.origins || {};

    // Define helpers
    this.config.helpers = this.config.helpers || [];
    this.config.helpers.push('axios');
    this.config.helpers.push('bull');
    this.config.helpers.push('bcryptjs');
    this.config.helpers.push('busboy');
    this.config.helpers.push('change-case');
    this.config.helpers.push('crypto');
    this.config.helpers.push('ejs');
    this.config.helpers.push('express');
    this.config.helpers.push('jsonwebtoken');
    this.config.helpers.push('mime-types');
    this.config.helpers.push('moment');
    this.config.helpers.push('mongoose');
    this.config.helpers.push('redis');
    this.config.helpers.push('socket.io');
    this.config.helpers.push('@socket.io/redis-adapter');
    this.config.helpers.push('uglify-js');
  }

  /**
   * Initialize
   */
  private async initialize(): Promise<any> {
    await this.initializeConfig();
    await this.initializeHelper();
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
    await this.initializeSystem();
  }

  /**
   * Initialize config
   */
  private async initializeConfig(): Promise<any> {
    console.info(`> initializing config`);
    try {
      const file = `${this.config.var}/config/${this.config.app}.${this.config.env}.json`;
      if (fs.existsSync(file)) {
        this.config = {...this.config, ...JSON.parse(fs.readFileSync(file).toString())};
      }
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the config module. ${error}`);
    }
  }

  /**
   * Initialize helper
   */
  private async initializeHelper(): Promise<any> {
    console.info(`> initializing helper`);
    try {
      for (const i of await this.getItems()) {
        this.helper[`${i.name}`] = i.call.default || i.call;
      }
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the helper module. ${error}`);
    }
  }

  /**
   * Initialize database
   */
  private async initializeDatabase(): Promise<any> {
    console.info(`> initializing database`);
    try {
      if (this.config.db) {
        this.helper.mongoose.set('strictQuery', false);
        this.database = await this.helper.mongoose.connect(this.config.mongo.url, this.config.mongo.options);
      }
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the database module. ${error}`);
    }
  }

  /**
   * Initialize controllers
   */
  private async initializeControllers(): Promise<any> {
    console.info(`> initializing controllers`);
    try {
      for (const f of await this.getFiles(path.resolve(`${this.config.src}/app/controllers`))) {
        this.controllers[`${f.name}`] = f.call.default(this);
      }
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the controllers module. ${error}`);
    }
  }

  /**
   * Initialize models
   */
  private async initializeModels(): Promise<any> {
    console.info(`> initializing models`);
    try {
      for (const f of await this.getFiles(path.resolve(`${this.config.src}/app/models`))) {
        this.models[`${f.name}`] = f.call.default(this);
      }
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the models module. ${error}`);
    }
  }

  /**
   * Initialize routes
   */
  private async initializeRoutes(): Promise<any> {
    console.info(`> initializing routes`);
    try {
      for (const f of await this.getFiles(path.resolve(`${this.config.src}/app/routes`))) {
        this.routes[`${f.name}`] = f.call.default(this);
      }
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the routes module. ${error}`);
    }
  }

  /**
   * Initialize server
   */
  private async initializeServer(): Promise<any> {
    console.info(`> initializing server`);
    try {
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
      console.error(`- a fatal error occurred while initializing the server module. ${error}`);
    }
  }

  /**
   * Initialize queues
   */
  private async initializeWorker(): Promise<any> {
    console.info(`> initializing worker`);
    try {
      this.worker = new this.helper.bull('worker', `${this.config.redis.url}`, {prefix: `${this.config.app}`});
      this.worker._events = [];
      this.worker.push = (type: string, callback: any) => this.worker._events.push({type, callback});
      this.worker.pushJob = async (messages: any[]): Promise<any> => await this.worker.add('default', {messages}, {jobId: 'default'});
      this.worker.on('completed', (job: any) => job.remove());
      this.worker.on('failed', (job: any) => job.remove());
      this.worker.process('default', 1, async (job: any, done: any) => await this.executeWorkerJob(job, done));
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the worker module. ${error}`);
    }
  }

  /**
   * Initialize queues
   */
  private async initializeQueues(): Promise<any> {
    console.info(`> initializing queues`);
    try {
      this.queues = new this.helper.bull('queues', `${this.config.redis.url}`, {prefix: `${this.config.app}`});
      this.queues._events = [];
      this.queues.push = (type: string, callback: any) => this.queues._events.push({type, callback});
      this.queues.pushJob = async (messages: any[]): Promise<any> => await this.queues.add('default', {messages});
      this.queues.on('completed', (job: any) => job.remove());
      this.queues.on('failed', (job: any) => job.remove());
      this.queues.process('default', 1, async (job: any, done: any) => await this.executeQueuesJob(job, done));
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the queues module. ${error}`);
    }
  }

  /**
   * Initialize memory
   */
  private async initializeMemory(): Promise<any> {
    console.info(`> initializing memory`);
    try {
      this.memory = this.helper.redis.createClient({url: `${this.config.redis.url}`});
      await this.memory.connect();
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the memory module. ${error}`);
    }
  }

  /**
   * Initialize pub
   */
  private async initializePub(): Promise<any> {
    console.info(`> initializing pub`);
    try {
      this.pub = this.memory.duplicate();
      await this.pub.connect();
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the pub module. ${error}`);
    }
  }

  /**
   * Initialize sub
   */
  private async initializeSub(): Promise<any> {
    console.info(`> initializing sub`);
    try {
      this.sub = this.memory.duplicate();
      await this.sub.connect();
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the sub module. ${error}`);
    }
  }

  /**
   * Initialize socket
   */
  private async initializeSocket(): Promise<any> {
    console.info(`> initializing socket`);
    try {
      this.socket = new this.helper.socketIo.Server(this.server, {path: `/socket.io`, transports: ['websocket', 'polling']});
      this.socket.adapter(this.helper.socketIoRedisAdapter.createAdapter(this.pub, this.sub));
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the socket module. ${error}`);
    }
  }

  /**
   * Initialize system
   */
  private async initializeSystem(): Promise<any> {
    console.info(`> initializing system`);
    try {
      if (this.config.use?.length) {
        for (const callback of this.config.use) {
          const name = camelCase(`${callback.name}`).replace(/Plugin$/, '');
          this.plugins[`${name}`] = new callback(this, `${name}`);
          await this.plugins[`${name}`].register();
        }
      }
    } catch (error: any) {
      console.error(`- a fatal error occurred while initializing the system module. ${error}`);
    }
  }

  /**
   * Execute worker job
   */
  private async executeWorkerJob(job: any, done: any): Promise<any> {
    try {
      for (const event of this.worker._events) {
        if (event && event.type && typeof event.callback === 'function') {
          try {
            await event.callback();
            await this.sleep(1000);
          } catch (error: any) {
            console.error(`! worker job callback error. ${error}`);
          }
        }
      }
    } catch (error: any) {
      console.error(`! worker ${job.data?.check} job error. ${error}`);
    }
    done();
  }

  /**
   * Execute queues job
   */
  private async executeQueuesJob(job: any, done: any): Promise<any> {
    try {
      (async () => {
        if (!job.data.messages) {
          return;
        }

        // Define messages
        const messages: Message[] = [];
        for (const m of job.data.messages) {
          messages.push(new Message(m));
        }
        if (!messages.length) {
          return;
        }

        // Define settings
        const settings: any = {};

        // Define lock
        const lock = `lock:${settings.ticket}`;
        while (await this.memory.exists(lock)) {
          await this.sleep(1000);
        }
        await this.memory.set(lock, '1', {EX: 60});

        // Process dispatch events
        for (const event of this.queues._events) {
          if (event && event.type === 'dispatch' && typeof event.callback === 'function' && messages.length) {
            try {
              await event.callback(messages, settings);
            } catch (error: any) {
              console.error(`! queues job dispatch error. ${error}`);
            }
          }
        }

        // Process incoming events
        for (const event of this.queues._events) {
          if (event && event.type === 'incoming' && typeof event.callback === 'function' && messages.length) {
            try {
              await event.callback(messages, settings);
            } catch (error: any) {
              console.error(`! queues job incoming error. ${error}`);
            }
          }
        }

        // Process outgoing events
        for (const event of this.queues._events) {
          if (event && event.type === 'outgoing' && typeof event.callback === 'function' && messages.length) {
            try {
              await event.callback(messages, settings);
            } catch (error: any) {
              console.error(`! queues job outgoing error. ${error}`);
            }
          }
        }

        // Process shipping events
        for (const event of this.queues._events) {
          if (event && event.type === 'shipping' && typeof event.callback === 'function' && messages.length) {
            try {
              await event.callback(messages, settings);
            } catch (error: any) {
              console.error(`! queues job shipping error. ${error}`);
            }
          }
        }

        // Remove lock
        await this.memory.del(lock);
      })();
    } catch (error: any) {
      console.error(`! queues job error. ${error}`);
    }
    done();
  }

  /**
   * Get items
   */
  private async getItems(): Promise<any[]> {
    const result: any[] = [];
    for (const h of this.config.helpers) {
      try {
        result.push({name: camelCase(h), call: await import(h)});
      } catch (error: any) {
        console.error(`${error}`);
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
   * Sleep
   */
  async sleep(time: number): Promise<any> {
    const wait: any = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    await wait(time);
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    await this.initialize();

    // Listen signals
    process.on('SIGINT', () => {
      console.info('> sigint received, shutting down');
      this.stop();
    });
    process.on('SIGTERM', () => {
      console.info('> sigterm received, shutting down');
      this.stop();
    });
    process.on('SIGUSR2', async () => {
      console.info('> sigusr2 received, shutting down');
      await this.stop();
    });

    // Verify worker
    const check = async () => {
      const job = await this.worker.getJob('default');
      if (!job) {
        const c = parseInt((await this.memory.get(`${this.config.app}:worker-check`)) || 0) + 1;
        await this.memory.set(`${this.config.app}:worker-check`, `${c}`);
        await this.worker.add('default', {check: `${c}`}, {jobId: 'default'});
      }
      await this.sleep(1000);
      check();
    };
    check();

    // Define routes
    this.router.use('/api/', (req: any, res: any, next: any) => {
      try {
        req.data = {};
        req.data.body = {...req.body, ...req.query, ...req.params};
        req.data.auth = req.headers['authorization'] ? this.helper.jsonwebtoken.verify(req.headers['authorization'].split(' ').pop() || '', `${this.config.token.secret || ''}`) : false;
        res.data = req.data;
        next();
      } catch (error: any) {
        next(error);
      }
    });
    for (const route in this.routes) {
      this.router.use(`/api/${paramCase(route)}`, this.routes[`${route}`]);
    }

    // Define public route
    this.router.use(express.static(`${this.config.var}/public`, {dotfiles: 'deny', maxAge: 0, etag: false}));

    // Define error 404 route
    this.router.use((req: any, res: any) => {
      res.status(404).send();
      if (this.config.env === 'development') {
        console.warn(`- route 404 (${req.url})`);
      }
    });

    // Define error 500 route
    this.router.use((error: any, req: any, res: any, _next: any) => {
      res.status(500).send();
      if (this.config.env === 'development') {
        console.warn(`- route 500 (${req.url}) ${error}`);
      }
    });

    // Listen server
    await this.server.listen(this.config.server.port, () => {
      console.info(`! listening server on port ${this.config.server.port} (#${process.pid})`);
    });
  }

  /**
   * Stop
   */
  async stop(): Promise<any> {
    if (this.socket) {
      await this.socket.close();
    }
    if (this.database) {
      await this.database.disconnect();
    }
    process.exit(0);
  }
}

export type Request = express.Request;
export type Response = express.Response;
export type Next = express.NextFunction;
