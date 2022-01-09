import { Bot } from './bot';
import { Message } from './message';
import * as redis from 'redis';
import Bull from 'bull';

/**
 * Queues
 */
export class Queues {
  bot: Bot;
  sessionsStore: any;
  incomingQueue: any;
  outgoingQueue: any;

  /**
   * Constructor
   */
  constructor(bot: Bot) {
    if (!bot.config.queues) {
      throw new Error(`Queues config value is invalid.`);
    }
    if (!bot.config.queues.host) {
      throw new Error(`Queues config value is invalid, "host" is required.`);
    }
    if (!bot.config.queues.port) {
      throw new Error(`Queues config value is invalid, "port" is required.`);
    }
    this.bot = bot;
    this.initializeSessionsStore();
    this.initializeIncomingQueue();
    this.initializeOutgoingQueue();
  }

  /**
   * Initialize sessions store
   */
  private initializeSessionsStore() {
    this.sessionsStore = redis.createClient({ url: `redis://${this.bot.config.queues.host}:${this.bot.config.queues.port}` });
    this.sessionsStore.connect();
  }

  /**
   * Initialize incoming queue
   */
  private initializeIncomingQueue() {
    this.incomingQueue = new Bull(`incomingQueue`, `redis://${this.bot.config.queues.host}:${this.bot.config.queues.port}`);
    this.incomingQueue.process(async (job: any, done: any) => {
      for (const m of job.data.messages) {
        const message = new Message(m);
        await message.dispatchIncoming(this.bot);
      }
      done();
    });
  }

  /**
   * Initialize outgoing queue
   */
  private initializeOutgoingQueue() {
    this.outgoingQueue = new Bull(`outgoingQueue`, `redis://${this.bot.config.queues.host}:${this.bot.config.queues.port}`);
    this.outgoingQueue.process(async (job: any, done: any) => {
      for (const m of job.data.messages) {
        const message = new Message(m);
        await message.dispatchOutgoing(this.bot);
      }
      done();
    });
  }
}
