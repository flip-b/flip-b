import {Bot} from './bot';
import {Message} from './message';

/**
 * Plugin
 */
export abstract class Plugin {
  bot: Bot;
  plugin: string;
  config: any;
  status: any;

  /**
   * Constructor
   */
  constructor(bot: Bot, plugin: string, config: any) {
    this.bot = bot;
    this.plugin = plugin;
    this.config = config;
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
