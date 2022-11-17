import {Bot} from './bot';

/**
 * Queues
 */
export class Pubsub {
  // Pubsub definitions

  /**
   * Bot
   */
  bot: Bot;

  /**
   * Pub
   */
  pub: any;

  /**
   * Sub
   */
  sub: any;

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
    this.pub = this.bot.helper.redis.createClient({url: `${this.bot.config.redis.url}`});
    this.pub.connect();
    this.sub = this.pub.duplicate();
    this.sub.connect();
    this.sub.subscribe('config', (rawMessage: string) => {
      try {
        const message: any = JSON.parse(rawMessage);
        if (typeof message.plugin !== 'undefined') {
          this.bot.config.plugins[`${message.plugin}`] = message.config || undefined;
        }
        if (typeof message.origin !== 'undefined') {
          this.bot.config.origins[`${message.origin}`] = message.config || undefined;
        }
      } catch (error: any) {
        console.error(`${error}`);
      }
    });
    this.pub.publish('startup', JSON.stringify({
      instance: process.env.SERVER_INSTANCE || process.env.AWS_INSTANCE || process.env.GAE_INSTANCE || 'default'
    }));
  }

  /**
   * Start
   */
  async start(): Promise<any> {
    await this.initialize();
  }
}
