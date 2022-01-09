import { Plugin, Message, Request, Response } from '@flip-b/bot';

/**
 * Tags plugin
 */
export class TagsPlugin extends Plugin {
  override status: any = ['agent side', 'outgoing', 'transfer'];

  /**
   * Register
   */
  override async register(): Promise<any> {
    this.bot.server.router.get(`/${this.plugin}/status`, (req: Request, res: Response) => {
      res.send({ plugin: this.plugin, status: this.status, method: req.method });
    });
  }

  /**
   * Dispatch incoming message
   */
  override async dispatchIncomingMessage(message: Message): Promise<any> {
    if (!message.action && !message.intent && message.text) {
      message.intent = `${message.text}`.toLowerCase().trim().split(' ').pop() || '';
      message.wait = 1500;
    }
    if (!message.action && !message.intent && !message.text && message.data?.length > 0) {
      message.intent = `data`;
    }
    await message.execute(this.bot);
  }
}
