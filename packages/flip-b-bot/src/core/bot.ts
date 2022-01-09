import { Server } from './server';
import { Queues } from './queues';
import { Plugin } from './plugin';
import { Message } from './message';
import dotenv from 'dotenv';

/**
 * Bot
 */
export class Bot {
  config: any;
  server: Server;
  queues: Queues;
  plugins: { [key: string]: Plugin } = {};
  actions: { [key: string]: any } = {};
  intents: { [key: string]: any } = {};

  /**
   * Constructor
   */
  constructor(config: any = {}) {
    dotenv.config();
    config.env = config.env || process.env.NODE_ENV || 'development';
    config.cwd = config.cwd || process.env.NODE_CWD || process.cwd();

    config.router = config.router || {};
    config.router.compression = config.router.compression || {};
    config.router.cors = config.router.cors || {};
    config.router.json = config.router.json || {};
    config.router.urlencoded = config.router.urlencoded || { extended: true };
    config.router.public = config.router.static || { dest: `${config.cwd}/var/public`, path: `/` };
    config.router.upload = config.router.upload || { dest: `${config.cwd}/var/upload`, path: '/upload' };
    config.router.render = config.router.render || { dest: `${config.cwd}/var/render`, type: 'ejs' };

    config.server = config.server || {};
    config.server.host = config.server.host || process.env.SERVER_HOST || '127.0.0.1';
    config.server.port = config.server.port || process.env.SERVER_PORT || '8081';

    config.queues = config.queues || {};
    config.queues.host = config.queues.host || process.env.QUEUES_HOST || '127.0.0.1';
    config.queues.port = config.queues.port || process.env.QUEUES_PORT || '6379';

    config.plugin = config.plugin || {};

    this.config = config;
    this.server = new Server(this);
    this.queues = new Queues(this);
  }

  /**
   * Debug
   */
  debug(text: string) {
    if (this.config.env != 'development') {
      return;
    }
    console.info(text);
  }

  /**
   * Plugin
   */
  plugin(name: string, instance: any) {
    this.debug(`- loading plugin "${name}"`);
    this.plugins[`${name}`] = new instance(this, name);
  }

  /**
   * Action
   */
  action(name: string, callback: any) {
    this.debug(`- loading action "${name}"`);
    this.actions[`${name}`] = callback;
  }

  /**
   * Intent
   */
  intent(name: string, callback: any) {
    this.debug(`- loading intent "${name}"`);
    this.intents[`${name}`] = callback;
  }

  /**
   * Call
   */
  async call(name: string, message: Message): Promise<any> {
    message.action = '';
    message.intent = name;
    await message.execute(this);
  }

  /**
   * Wait
   */
  async wait(time: number): Promise<any> {
    const wait: any = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    await wait(time);
  }

  /**
   * Get session value
   */
  async getSessionValue(index: string): Promise<any> {
    return await this.queues.sessionsStore.get(index);
  }

  /**
   * Set session value
   */
  async setSessionValue(index: string, value: string): Promise<any> {
    return await this.queues.sessionsStore.set(index, value);
  }

  /**
   * Add incoming messages
   */
  async addIncomingMessages(messages: any[]): Promise<any> {
    return await this.queues.incomingQueue.add({ messages });
  }

  /**
   * Add outgoing message
   */
  async addOutgoingMessages(messages: any[]): Promise<any> {
    return await this.queues.outgoingQueue.add({ messages });
  }

  /**
   * Start
   */
  start() {
    this.server.start();
  }
}
