import {Server} from './server';
import {Pubsub} from './pubsub';
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
   * Server
   */
  server: Server | any;

  /**
   * Pubsub
   */
  pubsub: Pubsub | any;

  /**
   * Queues
   */
  queues: Queues | any;

  /**
   * Plugins
   */
  plugins: {[key: string]: Plugin} = {};

  /**
   * Events callbacks
   */
  $events: any[] = [];

  /**
   * Constructor
   */
  constructor(config: any = {}) {
    const folder = path.dirname((require.main || {}).filename || './src/index.ts');
    dotenv.config();

    // Define global options
    this.config = config;
    this.config.env = this.config.env || process.env.NODE_ENV || 'development';
    this.config.cwd = this.config.cwd || process.env.NODE_CWD || path.dirname(folder);
    this.config.src = this.config.src || process.env.NODE_SRC || path.resolve(folder);
    this.config.var = this.config.var || process.env.NODE_VAR || path.resolve(this.config.cwd, 'var');
    this.config.tmp = this.config.tmp || process.env.NODE_TMP || path.resolve(this.config.cwd, 'tmp');

    // Define server options
    this.config.server = this.config.server || {};
    this.config.server.port = this.config.server.port || process.env.SERVER_PORT || process.env.PORT || '8080';

    // Define router options
    this.config.router = this.config.router || {};
    this.config.router.compression = this.config.router.compression || {};
    this.config.router.cors = this.config.router.cors || {};
    this.config.router.json = this.config.router.json || {};
    this.config.router.urlencoded = this.config.router.urlencoded || {extended: true};
    this.config.router.public = this.config.router.static || {dest: `${this.config.var}/public`, path: `/`};
    this.config.router.upload = this.config.router.upload || {dest: `${this.config.var}/upload`, path: '/upload'};
    this.config.router.render = this.config.router.render || {dest: `${this.config.var}/render`, type: 'ejs'};

    // Define local options
    this.config.local = this.config.local || {};
    this.config.local.url = this.config.local.url || process.env.LOCAL_URL || `http://localhost:${this.config.server.port}`;

    // Define redis options
    this.config.redis = this.config.redis || {};
    this.config.redis.url = this.config.redis.url || process.env.REDIS_URL || `redis://localhost`;

    // Define plugins and origins
    this.config.plugins = this.config.plugins || {};
    this.config.origins = this.config.origins || {};
  }

  /**
   * Initialize
   */
  private async initialize(): Promise<any> {
    await this.initializeConfig();
    await this.initializeHelper();
    await this.initializeServer();
    await this.initializePubsub();
    await this.initializeQueues();
    await this.initializePlugins();
  }

  /**
   * Initialize config
   */
  private async initializeConfig(): Promise<any> {
    console.info(`> initializing config`);
    try {
      const file = `${this.config.var}/config/${process.env.CONFIG_FILE || 'default'}.json`;
      if (fs.existsSync(file)) {
        this.config = {...this.config, ...JSON.parse(fs.readFileSync(file).toString())};
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the config module. ${error}`);
    }
  }

  /**
   * Initialize helper
   */
  private async initializeHelper(): Promise<any> {
    console.info(`> initializing helper`);
    try {
      const items: any[] = await this.getItems();
      for (const i of items) {
        this.helper[`${i.name}`] = i.call.default || i.call;
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the helper module. ${error}`);
    }
  }

  /**
   * Initialize server
   */
  private async initializeServer(): Promise<any> {
    console.info(`> initializing server`);
    try {
      this.server = new Server(this);
      await this.server.start();
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the server module. ${error}`);
    }
  }

  /**
   * Initialize pubsub
   */
  private async initializePubsub(): Promise<any> {
    console.info(`> initializing pubsub`);
    try {
      this.pubsub = new Pubsub(this);
      await this.pubsub.start();
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the pubsub module. ${error}`);
    }
  }

  /**
   * Initialize queues
   */
  private async initializeQueues(): Promise<any> {
    console.info(`> initializing queues`);
    try {
      this.queues = new Queues(this);
      await this.queues.start();
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the queues module. ${error}`);
    }
  }

  /**
   * Initialize plugins
   */
  private async initializePlugins(): Promise<any> {
    this.debug(`> initializing plugins`);
    try {
      for (const callback of this.config.use || []) {
        const name = camelCase(`${callback.name}`).replace(/Plugin$/, '');
        await this.registerPlugin(`${name}`, callback);
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the plugins module. ${error}`);
    }
  }

  /**
   * Get items
   */
  private async getItems(): Promise<any[]> {
    const values: any = [
      '@socket.io/redis-adapter',
      'axios',
      'bcryptjs',
      'bull',
      'busboy',
      'change-case',
      'crypto',
      'ejs',
      'express',
      'fs',
      'http',
      'https',
      'jsonwebtoken',
      'mime-types',
      'moment',
      'path',
      'redis',
      'socket.io',
      'uglify-js'
    ];
    const result: any[] = [];
    for (const v of values) {
      try {
        result.push({name: camelCase(v), call: await import(v)});
      } catch (error: any) {
        console.error(`${error}`);
      }
    }
    return result;
  }

  /**
   * Register plugin
   */
  async registerPlugin(name: string, callback: any): Promise<any> {
    this.plugins[`${name}`] = new callback(this, `${name}`);
    await this.plugins[`${name}`].register();
  }

  /**
   * Register training event
   */
  async registerTrainingEvent(callback: any): Promise<any> {
    this.$events.push({name: 'training', callback});
  }

  /**
   * Register incoming event
   */
  async registerIncomingEvent(callback: any): Promise<any> {
    this.$events.push({name: 'incoming', callback});
  }

  /**
   * Register outgoing event
   */
  async registerOutgoingEvent(callback: any): Promise<any> {
    this.$events.push({name: 'outgoing', callback});
  }

  /**
   * Register shipping event
   */
  async registerShippingEvent(callback: any): Promise<any> {
    this.$events.push({name: 'shipping', callback});
  }

  /**
   * Register event
   */
  async registerEvent(name: string, callback: any): Promise<any> {
    this.$events.push({name, callback});
  }

  /**
   * Register route
   */
  async registerRoute(name: string, path: string, callback: any): Promise<any> {
    this.server.router[name](path, callback);
  }

  /**
   * Add incoming messages
   */
  async addIncomingMessages(messages: any[]): Promise<any> {
    await this.queues.incomingQueue.add({messages});
  }

  /**
   * Add outgoing message
   */
  async addOutgoingMessages(messages: any[]): Promise<any> {
    await this.queues.outgoingQueue.add({messages});
  }

  /**
   * Add sessions value
   */
  async addSessionsValue(index: string, value: any, expire: any = undefined): Promise<any> {
    const store: any = JSON.stringify(value);
    await this.queues.sessionsStore.set(index, store, {EX: expire || 60 * 60 * 24});
  }

  /**
   * Get sessions value
   */
  async getSessionsValue(index: string): Promise<any> {
    const value: any = await this.queues.sessionsStore.get(index);
    return value ? JSON.parse(value) : {};
  }

  /**
   * On
   */
  async on(name: string, callback: any): Promise<any> {
    this.registerEvent(name, callback);
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
   * Execute action
   */
  async executeAction(name: string, messages: any[]): Promise<any> {
    for (const m of messages) {
      try {
        if (name === 'incoming' && m.target && this.plugins[`${m.target}`]) {
          await this.plugins[`${m.target}`].dispatchIncomingMessage(m);
        } else if (name === 'outgoing' && m.source && this.plugins[`${m.source}`]) {
          await this.plugins[`${m.source}`].dispatchOutgoingMessage(m);
        }
        m.status = 'delivered';
      } catch (error: any) {
        m.status = 'failed';
      }
    }
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
    process.on('SIGINT', () => {
      console.info('> sigint received, shutting down');
      this.stop();
    });
    process.on('SIGTERM', () => {
      console.info('> sigterm received, shutting down');
      this.stop();
    });
  }

  /**
   * Stop
   */
  async stop(): Promise<any> {
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
}
