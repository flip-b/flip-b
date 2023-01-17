import express from 'express';
import compression from 'compression';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
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
  tests: any = {};

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
   * Initialize
   */
  private async initialize(): Promise<any> {
    await this.initializeConfig();
    await this.initializeHelper();
    await this.initializeDatabase();
    await this.initializeControllers();
    await this.initializeModels();
    await this.initializeRoutes();
    await this.initializeTasks();
    await this.initializeTests();
    await this.initializeRouter();
    await this.initializeServer();
  }

  /**
   * Initialize config
   */
  private async initializeConfig(): Promise<any> {
    console.info(`> initializing config`);
    try {
      const file = path.resolve(`${this.config.src}/config/${this.config.env.toLowerCase()}`);
      const data = await import(file);
      this.config = {...this.config, ...data.default};
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the config module. ${error}`);
    }
  }

  /**
   * Initialize database
   */
  private async initializeDatabase(): Promise<any> {
    console.info(`> initializing database`);
    try {
      if (this.config.database) {
        this.helper.mongoose.set('strictQuery', false);
        this.database = await this.helper.mongoose.connect(`${this.config.database.url}`, this.config.database.options);
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the database module. ${error}`);
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
   * Initialize controllers
   */
  private async initializeControllers(): Promise<any> {
    console.info(`> initializing controllers`);
    try {
      const files: any[] = await this.getFiles(path.resolve(`${this.config.src}/controllers`));
      for (const f of files) {
        this.controllers[`${f.name}`] = new f.call.default(this).getController();
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the controllers module. ${error}`);
    }
  }

  /**
   * Initialize models
   */
  private async initializeModels(): Promise<any> {
    console.info(`> initializing models`);
    try {
      const files: any[] = await this.getFiles(path.resolve(`${this.config.src}/models`));
      for (const f of files) {
        this.models[`${f.name}`] = new f.call.default(this).getModel();
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the models module. ${error}`);
    }
  }

  /**
   * Initialize routes
   */
  private async initializeRoutes(): Promise<any> {
    console.info(`> initializing routes`);
    try {
      const files: any[] = await this.getFiles(path.resolve(`${this.config.src}/routes`));
      for (const f of files) {
        this.routes[`${f.name}`] = new f.call.default(this).getRoute();
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the routes module. ${error}`);
    }
  }

  /**
   * Initialize tasks
   */
  private async initializeTasks(): Promise<any> {
    console.info(`> initializing tasks`);
    try {
      const files: any[] = await this.getFiles(path.resolve(`${this.config.src}/tasks`));
      for (const f of files) {
        this.tasks[`${f.name}`] = new f.call.default(this).getTask();
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the tasks module. ${error}`);
    }
  }

  /**
   * Initialize tests
   */
  private async initializeTests(): Promise<any> {
    console.info(`> initializing tests`);
    try {
      const files: any[] = await this.getFiles(path.resolve(`${this.config.src}/tests`));
      for (const f of files) {
        this.tests[`${f.name}`] = new f.call.default(this).getTest();
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the tests module. ${error}`);
    }
  }

  /**
   * Initialize router
   */
  private async initializeRouter(): Promise<any> {
    console.info(`> initializing router`);
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
      this.router.use(routeHandler(this));
      this.router.use(filesHandler(this));
      this.router.use(mountHandler(this));
      this.router.use(errorHandler(this));
    } catch (error: any) {
      console.error(`A fatal error occurred while initializing the router module. ${error}`);
    }
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
    console.info(`> initializing server`);
    this.server.listen(this.config.server?.port).on('listening', () => {
      console.info(`> listening server on port ${this.config.server.port} (#${process.pid})`);
    });
  }

  /**
   * Disconnect
   */
  private async disconnect(): Promise<any> {
    try {
      if (this.database) {
        await this.database.disconnect();
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while disconnected the application. ${error}`);
    }
  }

  /**
   * Run task
   */
  private async runTask(args: string[]): Promise<any> {
    try {
      const module = camelCase(args.shift() || '');
      const method = camelCase(args.shift() || '');
      console.info(`> Run "${module}.${method}" task`);
      const result: any = await this.tasks[`${module}`][`${method}`](this.helper.yargs(args).argv);
      if (result) {
        console.log(result);
      }
    } catch (error: any) {
      console.error(`A fatal error occurred while runing task. ${error}`);
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
      console.error(`A fatal error occurred while runing test. ${error}`);
    }
    await this.stop();
  }

  /**
   * Get items
   */
  private async getItems(): Promise<any[]> {
    const values: any = ['mongoose', 'express', 'busboy', 'change-case', 'ejs', 'fs', 'path', 'http', 'https', 'yargs', 'crypto', 'bcryptjs', 'jsonwebtoken', 'mime-types'];
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
    process.on('SIGINT', () => {
      console.info('> sigint received, shutting down');
      this.stop();
    });
    process.on('SIGTERM', () => {
      console.info('> sigterm received, shutting down');
      this.stop();
    });
    await this.initialize();
  }

  /**
   * Stop
   */
  async stop(): Promise<any> {
    await this.disconnect();
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
