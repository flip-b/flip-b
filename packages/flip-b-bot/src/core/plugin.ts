import {Bot} from './bot';
import {Message} from './message';

/**
 * Plugin
 */
export abstract class Plugin {
  // Plugin definitions

  /**
   * Bot
   */
  bot: Bot;

  /**
   * Plugin
   */
  plugin: string;

  /**
   * Constructor
   */
  constructor(bot: Bot, plugin: string) {
    this.bot = bot;
    this.plugin = plugin;
  }

  /**
   * Register
   */
  async register(): Promise<any> {
    if (this.plugin) {
      return true;
    }
  }

  /**
   * Dispatch incoming message
   */
  async dispatchIncomingMessage(message: Message): Promise<any> {
    if (this.plugin && message) {
      return true;
    }
  }

  /**
   * Dispatch outgoing message
   */
  async dispatchOutgoingMessage(message: Message): Promise<any> {
    if (this.plugin && message) {
      return true;
    }
  }
}
