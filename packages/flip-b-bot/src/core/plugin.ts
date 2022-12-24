import {Bot} from './bot';

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
}
