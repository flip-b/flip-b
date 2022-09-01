import {Bot} from './bot';
import {Message} from './message';
import Bull from 'bull';
import * as redis from 'redis';

/**
 * Queues
 */
export class Queues {
  bot: Bot;
  incomingQueue: any;
  outgoingQueue: any;
  sessionsStore: any;

  /**
   * Constructor
   */
  constructor(bot: Bot) {
    this.bot = bot;
    this.initialize();
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
    this.incomingQueue = new Bull(`incomingQueue`, `redis://${this.bot.config.queues.host}:${this.bot.config.queues.port}`);
    this.incomingQueue.on('completed', (job: any) => job.remove());
    this.incomingQueue.on('failed', (job: any) => job.remove());
    this.incomingQueue.process(15, async (job: any, done: any) => {
      const messages: Message[] = [];
      for (const m of job.data.messages) {
        m.type = 'incoming';
        messages.push(new Message(m));
        await this.sleep(5);
      }

      // Process incoming source session values
      for (const m of messages) {
        try {
          const s: any = await this.getSessionValue(`${m.ticket}`);
          if (!m.target && s.target) {
            m.target = s.target;
          }
          if (!m.target) {
            m.target = this.bot.plugins[`${m.source}`]?.config?.target || '';
          }
          await this.setSessionValue(`${m.ticket}`, {source: m.source, target: m.target, language: m.language, settings: m.settings});
        } catch (error: any) {
          console.error(`${error}`);
        }
      }

      // Execute incoming events
      if (messages.length) {
        try {
          await this.bot.executeEvents('incoming', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
      }

      // Execute dispatch
      for (const m of messages) {
        try {
          await this.bot.plugins[`${m.target}`].dispatchIncomingMessage(m);
          m.status = 'delivered';
        } catch (error: any) {
          m.status = 'failed';
        }
      }

      // Execute shipping events
      if (messages.length) {
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
    this.outgoingQueue = new Bull(`outgoingQueue`, `redis://${this.bot.config.queues.host}:${this.bot.config.queues.port}`);
    this.outgoingQueue.on('completed', (job: any) => job.remove());
    this.outgoingQueue.on('failed', (job: any) => job.remove());
    this.outgoingQueue.process(15, async (job: any, done: any) => {
      const messages: Message[] = [];
      for (const m of job.data.messages) {
        m.type = 'outgoing';
        messages.push(new Message(m));
        await this.sleep(5);
      }

      // Process outgoing source session values
      for (const m of messages) {
        try {
          const s: any = await this.getSessionValue(`${m.ticket}`);
          if (!m.target && s.target) {
            m.target = s.target;
          }
          if (!m.target) {
            m.target = this.bot.plugins[`${m.source}`]?.config?.target || '';
          }
          await this.setSessionValue(`${m.ticket}`, {source: m.source, target: m.target, language: m.language, settings: m.settings});
        } catch (error: any) {
          console.error(`${error}`);
        }
      }

      // Execute outgoing events
      if (messages.length) {
        try {
          await this.bot.executeEvents('outgoing', messages);
        } catch (error: any) {
          console.error(`${error}`);
        }
      }

      // Execute dispatch
      for (const m of messages) {
        try {
          await this.bot.plugins[`${m.source}`].dispatchOutgoingMessage(m);
          m.status = 'delivered';
        } catch (error: any) {
          m.status = 'failed';
        }
      }

      // Execute shipping events
      if (messages.length) {
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
    this.sessionsStore = redis.createClient({url: `redis://${this.bot.config.queues.host}:${this.bot.config.queues.port}`});
    this.sessionsStore.connect();
  }

  /**
   * Get session value
   */
  private async getSessionValue(index: string): Promise<any> {
    const value: any = await this.sessionsStore.get(index);
    return value ? JSON.parse(value) : {};
  }

  /**
   * Set session value
   */
  private async setSessionValue(index: string, value: any): Promise<any> {
    const store: any = JSON.stringify(value);
    return await this.sessionsStore.set(index, store, {EX: 60 * 60 * 24});
  }

  /**
   * Sleep
   */
  private async sleep(time: number): Promise<any> {
    const wait: any = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    await wait(time);
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    console.info(`> listening queues on ${this.bot.config.queues.host}:${this.bot.config.queues.port} (#${process.pid})`);
  }

  /**
   * Stop
   */
  async stop(): Promise<any> {
    console.info(`> stopping queues`);
  }
}
