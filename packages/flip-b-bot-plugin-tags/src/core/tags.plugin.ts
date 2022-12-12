import {Plugin, Message, Request, Response} from '@flip-b/bot';

/**
 * Tags plugin
 */
export class TagsPlugin extends Plugin {
  // Plugin definitions

  /**
   * Register
   */
  override async register(): Promise<any> {
    // Register

    // Define router event
    this.app.router.post(`/${this.plugin}/response`, async (req: Request, res: Response) => {
      try {
        await this.app.queues.pushJob(req.body.messages);
        res.status(200).send();
      } catch (error: any) {
        res.status(400).send();
      }
    });

    // Define queues event
    this.app.queues.push('shipping', async (messages: Message[]): Promise<any> => {
      try {
        const origin: any = this.app.config.origins[`${messages[0].origin || ''}`] || {};
        const config: any = origin[`${this.plugin}`] || this.app.config.plugins[`${this.plugin}`] || undefined;
        if (!config || !config.enabled) {
          return;
        }
        await this.app.helper.axios.request({
          url: config.url,
          method: config.method || 'POST',
          headers: config.headers || {},
          timeout: config.timeout || 10000,
          data: {
            messages: messages.map((message: Message) => message.toObject()),
            response: config.response || {}
          }
        });
        return true;
      } catch (error: any) {
        return false;
      }
    });
  }
}
