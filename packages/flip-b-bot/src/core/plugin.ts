import {Bot} from './bot';
import {Message} from './message';

/**
 * Plugin
 */
export abstract class Plugin {
  // Plugin definitions

  /**
   * Application
   */
  app: Bot;

  /**
   * Plugin
   */
  plugin: string;

  /**
   * Constructor
   */
  constructor(app: Bot, plugin: string) {
    this.app = app;
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
