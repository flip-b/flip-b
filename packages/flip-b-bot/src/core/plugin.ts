import {Bot} from './bot';

/**
 * Plugin
 */
export abstract class Plugin {
  // Definitions

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
    return this.plugin ? true : false;
  }

  /**
   * Dispatch
   */
  async dispatch(message: any): Promise<boolean> {
    return message ? true : false;
  }

  /**
   * Delivery
   */
  async delivery(message: any): Promise<boolean> {
    return message ? true : false;
  }
}
