import {Plugin, Message, Request, Response} from '@flip-b/bot';

/**
 * Pipe plugin
 */
export class PipePlugin extends Plugin {
  // Plugin definitions

  /**
   * Register
   */
  override async register(): Promise<any> {
    // Register

    // Define route
    this.bot.registerRoute('post', `/${this.plugin}/response`, async (req: Request, res: Response) => {
      try {
        await this.bot.addOutgoingMessages(req.body.messages);
        res.status(200).send();
      } catch (error: any) {
        res.status(400).send();
      }
    });

    // Define event
    this.bot.registerShippingEvent(async (messages: Message[]): Promise<any> => {
      try {
        const origin: any = this.bot.config.origins[`${messages[0].origin || ''}`] || {};
        const config: any = origin[`${this.plugin}`] || this.bot.config.plugins[`${this.plugin}`] || undefined;
        if (!config || !config.enabled) {
          return;
        }
        await this.bot.helper.axios.request({
          url: config.url,
          method: config.method || 'POST',
          headers: config.headers || {},
          timeout: config.timeout || 10000,
          data: {
            messages: messages.map((message: Message) => message.toObject()),
            response: {...this.bot.config.local, ...(config.response || {})}
          }
        });
        return true;
      } catch (error: any) {
        return false;
      }
    });
  }
}
