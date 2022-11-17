import {Bot} from './bot';
import {Message} from './message';

/**
 * Queues
 */
export class Queues {
  // Queues definitions

  /**
   * Bot
   */
  bot: Bot;

  /**
   * Incoming queue
   */
  incomingQueue: any;

  /**
   * Outgoing queue
   */
  outgoingQueue: any;

  /**
   * Sessions store
   */
  sessionsStore: any;

  /**
   * Constructor
   */
  constructor(bot: Bot) {
    this.bot = bot;
  }

  /**
   * Initialize
   */
  private async initialize(): Promise<any> {
    await this.initializeIncomingQueue();
    await this.initializeOutgoingQueue();
    await this.initializeSessionsStore();
  }

  /**
   * Initialize incoming queue
   */
  private async initializeIncomingQueue(): Promise<any> {
    this.incomingQueue = new this.bot.helper.bull(`incomingQueue`, `${this.bot.config.redis.url}`);
    this.incomingQueue.on('completed', (job: any) => job.remove());
    this.incomingQueue.on('failed', (job: any) => job.remove());
    this.incomingQueue.process(100, async (job: any, done: any) => {
      const messages: Message[] = [];
      for (const m of job.data.messages) {
        m.type = 'incoming';
        messages.push(new Message(m));
      }
      if (messages.length) {
        try {
          await this.bot.executeEvents('training', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
        try {
          await this.bot.executeEvents('incoming', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
        try {
          await this.bot.executeAction('incoming', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
        try {
          await this.bot.executeEvents('shipping', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
      }
      done();
    });
  }

  /**
   * Initialize outgoing queue
   */
  private async initializeOutgoingQueue(): Promise<any> {
    this.outgoingQueue = new this.bot.helper.bull(`outgoingQueue`, `${this.bot.config.redis.url}`);
    this.outgoingQueue.on('completed', (job: any) => job.remove());
    this.outgoingQueue.on('failed', (job: any) => job.remove());
    this.outgoingQueue.process(100, async (job: any, done: any) => {
      const messages: Message[] = [];
      for (const m of job.data.messages) {
        m.type = 'outgoing';
        messages.push(new Message(m));
      }
      if (messages.length) {
        try {
          await this.bot.executeEvents('training', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
        try {
          await this.bot.executeEvents('outgoing', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
        try {
          await this.bot.executeAction('outgoing', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
        try {
          await this.bot.executeEvents('shipping', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
      }
      done();
    });
  }

  /**
   * Initialize sessions store
   */
  private async initializeSessionsStore(): Promise<any> {
    this.sessionsStore = this.bot.helper.redis.createClient({url: `${this.bot.config.redis.url}`});
    this.sessionsStore.connect();
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    await this.initialize();
  }
}
