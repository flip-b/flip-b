import {Plugin, Message, Request, Response} from '@flip-b/bot';
import {client} from './chat.client';

/**
 * Chat plugin
 */
export class ChatPlugin extends Plugin {
  override status: any = ['human side', 'incoming'];
  client: any;
  socket: any;

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
    this.bot.server.router.get(`${this.bot.config.server.path}/${this.plugin}/chat.js`, (req: Request, res: Response) => {
      let client = `${this.client.standard || ''}`;
      client = client.replace('_URL_ROOT_', `${req.protocol}://${req.get('host')}`);
      client = client.replace('_URL_PATH_', `${this.bot.config.server.path}/${this.plugin}`);
      res.send(client);
    });

    // Define server route
    this.bot.server.router.get(`${this.bot.config.server.path}/${this.plugin}/chat.min.js`, (req: Request, res: Response) => {
      let client = `${this.client.minified || ''}`;
      client = client.replace('_URL_ROOT_', `${req.protocol}://${req.get('host')}`);
      client = client.replace('_URL_PATH_', `${this.bot.config.server.path}/${this.plugin}`);
      res.send(client);
    });

    // Define Client
    this.client = {
      standard: client(this.bot, this.config.client),
      minified: client(this.bot, this.config.client, {minify: true})
    };

    // Define Socket.io
    this.socket = new this.bot.helper.socketIo.Server(this.bot.server.server, {
      path: `${this.bot.config.queues.path}/${this.plugin}/socket.io`,
      cookie: false,
      transports: ['websocket', 'polling']
    });

    // Define Redis Pub
    const pubClient = this.bot.helper.redis.createClient({url: `redis://${this.bot.config.queues.host}:${this.bot.config.queues.port}`});
    await pubClient.connect();

    // Define Redis Sub
    const subClient = pubClient.duplicate();
    await subClient.connect();

    // Define Socket.io Redis Adapter
    this.socket.adapter(this.bot.helper.socketIoRedisAdapter.createAdapter(pubClient, subClient));

    // Define Socket.io connection event
    this.socket.on('connection', (socket: any) => {
      const session = `${socket.handshake.query.session}`;
      socket.join(session);
      socket.on('message', async (message: any) => {
        this.bot.addIncomingMessages([{ticket: session, source: `${this.plugin}`, ...message}]);
      });
      socket.on('disconnect', () => {
        const timeout = typeof this.config.timeout === 'undefined' ? 15000 : this.config.timeout || 0;
        setTimeout(async () => {
          const sockets = await this.socket.in(session).allSockets();
          if (sockets.size === 0 && timeout > 0) {
            this.bot.addIncomingMessages([{ticket: session, source: `${this.plugin}`, action: 'waiting'}]);
          }
        }, 100);
        setTimeout(async () => {
          const sockets = await this.socket.in(session).allSockets();
          if (sockets.size === 0) {
            this.bot.addIncomingMessages([{ticket: session, source: `${this.plugin}`, action: 'disconnect'}]);
          }
        }, 500 + timeout);
      });
    });
  }

  /**
   * Dispatch outgoing message
   */
  override async dispatchOutgoingMessage(message: Message): Promise<any> {
    await this.socket.to(`${message.ticket}`).emit('message', message.toObject());
  }
}
