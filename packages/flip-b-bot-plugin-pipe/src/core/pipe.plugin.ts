import {Plugin, Message, Request, Response} from '@flip-b/bot';

/**
 * Pipe plugin
 */
export class PipePlugin extends Plugin {
  override status: any = ['agent side', 'outgoing', 'transfer'];

  /**
   * Register
   */
  override async register(): Promise<any> {
    // Define plugin methods

    // Define server route
    this.bot.server.router.get(`${this.bot.config.server.path}/${this.plugin}/status`, (req: Request, res: Response) => {
      res.send({plugin: this.plugin, status: this.status, method: req.method});
    });

    // Define server route
    this.bot.server.router.all(`${this.bot.config.server.path}/${this.plugin}/listen`, (req: Request, res: Response) => {
      this.bot.addOutgoingMessages(req.body.messages);
      res.send({status: 200});
    });

    // Define shipping event
    this.bot.on('shipping', async (messages: Message[]): Promise<any> => {
      await this.bot.helper.axios
        .request({
          url: this.config.url,
          method: this.config.method || 'POST',
          headers: this.config.headers || {},
          timeout: this.config.timeout || 10000,
          data: {
            messages: messages.map((message: Message) => message.toObject())
          }
        })
        .catch((error: any) => {
          console.log(`${error}`);
        });
    });
  }

  /**
   * Dispatch incoming message
   */
  override async dispatchIncomingMessage(message: Message): Promise<any> {
    if (message) {
      return true;
    }
  }
}
