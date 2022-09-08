import {Server} from './server';
import {Queues} from './queues';
import {Plugin} from './plugin';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {camelCase} from 'change-case';

/**
 * Bot
 */
export class Bot {
  config: any;
  helper: any;
  server: Server | any;
  queues: Queues | any;

  plugins: {[key: string]: Plugin} = {};
  $events: any[] = [];

  /**
   * Constructor
   */
  constructor(config: any = {}) {
    const folder = path.dirname((require.main || {}).filename || './src/index.ts');

    // Define environment config
    dotenv.config();

    // Define global options
    this.config = config;
    this.config.env = this.config.env || process.env.NODE_ENV || 'development';
    this.config.cwd = this.config.cwd || process.env.NODE_CWD || path.dirname(folder);
    this.config.src = this.config.src || process.env.NODE_SRC || path.resolve(folder);
    this.config.var = this.config.var || process.env.NODE_VAR || path.resolve(this.config.cwd, 'var');
    this.config.tmp = this.config.tmp || process.env.NODE_TMP || path.resolve(this.config.cwd, 'tmp');

    // Define config from file
    try {
      //const file = `${this.config.var}/config/${process.env.CONFIG_FILE || 'default'}/${this.config.env}.json`;
      const file = `${this.config.var}/config/${process.env.CONFIG_FILE || 'default'}.json`;
      if (fs.existsSync(file)) {
        this.config = {...this.config, ...JSON.parse(fs.readFileSync(file).toString())};
      }
    } catch (error: any) {
      console.error(`${error}`);
    }

    // Define server router options
    this.config.router = this.config.router || {};
    this.config.router.compression = this.config.router.compression || {};
    this.config.router.cors = this.config.router.cors || {};
    this.config.router.json = this.config.router.json || {};
    this.config.router.urlencoded = this.config.router.urlencoded || {extended: true};
    this.config.router.public = this.config.router.static || {dest: `${this.config.var}/public`, path: `/`};
    this.config.router.upload = this.config.router.upload || {dest: `${this.config.var}/upload`, path: '/upload'};
    this.config.router.render = this.config.router.render || {dest: `${this.config.var}/render`, type: 'ejs'};

    // Define server options
    this.config.server = this.config.server || {};
    this.config.server.host = this.config.server.host || process.env.SERVER_HOST || '127.0.0.1';
    this.config.server.port = this.config.server.port || process.env.SERVER_PORT || '8080';
    this.config.server.path = this.config.server.path || process.env.SERVER_PATH || '';

    // Define queues options
    this.config.queues = this.config.queues || {};
    this.config.queues.host = this.config.queues.host || process.env.QUEUES_HOST || '127.0.0.1';
    this.config.queues.port = this.config.queues.port || process.env.QUEUES_PORT || '6379';
    this.config.queues.path = this.config.queues.path || process.env.QUEUES_PATH || '';

    // Define redis options
    this.config.redis = this.config.redis || {};
    this.config.redis.url = this.config.redis.url || process.env.REDIS_URL || `redis://${this.config.queues.host}:${this.config.queues.port}`;

    // Define context options
    this.config.context = this.config.context || {};

    // Define plugins options
    this.config.plugins = this.config.plugins || {};
  }

  /**
   * Initialize
   */
  private async initialize(): Promise<any> {
    await this.initializeHelper();
    await this.initializeServer();
    await this.initializeQueues();
    await this.initializePlugins();
  }

  /**
   * Initialize server
   */
  private async initializeServer(): Promise<any> {
    this.debug(`> initializing server`);
    this.server = new Server(this);
  }

  /**
   * Initialize queues
   */
  private async initializeQueues(): Promise<any> {
    this.debug(`> initializing queues`);
    this.queues = new Queues(this);
  }

  /**
   * Initialize helper
   */
  private async initializeHelper(): Promise<any> {
    this.debug(`> initializing helper`);
    this.helper = {};
    const list = [
      'axios',
      'bcryptjs',
      'busboy',
      'change-case',
      'crypto',
      'ejs',
      'fs',
      'path',
      'http',
      'https',
      'jsonwebtoken',
      'mime-types',
      'redis',
      'socket.io',
      '@socket.io/redis-adapter',
      'uglify-js'
    ];
    for (const l of list) {
      const helper = await import(`${l}`);
      this.helper[`${camelCase(l)}`] = helper.default || helper;
    }
  }

  /**
   * Initialize plugins
   */
  private async initializePlugins(): Promise<any> {
    this.debug(`> initializing plugins`);
    for (const p in this.config.plugins) {
      const plugin: any = this.config.plugins[`${p}`];
      const object: any = this.config.use.find((o: any) => `${o.name}` == `${plugin.plugin}`);
      if (object) {
        console.info(`> listening plugin "${p}"`);
        this.plugins[`${p}`] = new object(this, `${p}`, plugin.config);
        await this.plugins[`${p}`].register();
      }
    }
  }

  /**
   * On
   */
  async on(name: string, callback: any): Promise<any> {
    this.debug(`> listening event "${name}"`);
    this.$events.push({name, callback});
  }

  /**
   * Add incoming messages
   */
  async addIncomingMessages(messages: any[]): Promise<any> {
    return await this.queues.incomingQueue.add({messages});
  }

  /**
   * Add outgoing message
   */
  async addOutgoingMessages(messages: any[]): Promise<any> {
    return await this.queues.outgoingQueue.add({messages});
  }

  /**
   * Execute events
   */
  async executeEvents(name: string, messages: any[]): Promise<any> {
    for (const $event of this.$events) {
      if ($event.name === name && typeof $event.callback === 'function' && messages.length) {
        await $event.callback(messages);
      }
    }
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    await this.initialize();
    await this.server.start();
    await this.queues.start();
  }

  /**
   * Stop
   */
  async stop(): Promise<any> {
    this.server.stop();
    this.queues.stop();
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
