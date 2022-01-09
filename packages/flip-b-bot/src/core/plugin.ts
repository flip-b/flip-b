import { Bot } from './bot';
import { Message } from './message';

/**
 * Plugin
 */
export abstract class Plugin {
  bot: Bot;
  plugin: any;
  config: any;
  status: any;

  /**
   * Constructor
   */
  constructor(bot: Bot, plugin: string) {
    if (!bot.config.plugin) {
      throw new Error(`Plugin config value is invalid.`);
    }
    if (!bot.config.plugin[`${plugin}`]) {
      throw new Error(`Plugin config value is invalid, "${plugin}" is required.`);
    }
    this.bot = bot;
    this.plugin = `${plugin}`;
    this.config = this.bot.config.plugin[`${plugin}`];

    this.register()
      .then(() => {
        console.info(`> listening plugin ${this.plugin}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Register
   */
  async register(): Promise<any> {
    console.warn(`! unsupported ${this.plugin}.register method`);
  }

  /**
   * Dispatch incoming message
   */
  async dispatchIncomingMessage(message: Message): Promise<any> {
    console.warn(`! unsupported ${this.plugin}.dispatchIncomingMessage method`, message);
  }

  /**
   * Dispatch outgoing message
   */
  async dispatchOutgoingMessage(message: Message): Promise<any> {
    console.warn(`! unsupported ${this.plugin}.dispatchOutgoingMessage method`, message);
  }
}
