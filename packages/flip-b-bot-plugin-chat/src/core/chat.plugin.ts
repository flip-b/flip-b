import { Plugin, Message, Request, Response } from '@flip-b/bot';
import { client } from './chat.client';
import * as socketIo from 'socket.io';
import * as socketIoRedis from '@socket.io/redis-adapter';
import * as redis from 'redis';

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
    this.bot.server.router.get(`/${this.plugin}/status`, (req: Request, res: Response) => {
      res.send({ plugin: this.plugin, status: this.status, method: req.method });
    });
    this.bot.server.router.get(`/${this.plugin}/chat.js`, (req: Request, res: Response) => {
      let client = `${this.client.standard || ''}`;
      client = client.replace('_URL_ROOT_', `${req.protocol}://${req.get('host')}`);
      client = client.replace('_URL_PATH_', `/${this.plugin}`);
      res.send(client);
    });
    this.bot.server.router.get(`/${this.plugin}/chat.min.js`, (req: Request, res: Response) => {
      let client = `${this.client.minified || ''}`;
      client = client.replace('_URL_ROOT_', `${req.protocol}://${req.get('host')}`);
      client = client.replace('_URL_PATH_', `/${this.plugin}`);
      res.send(client);
    });

    // Define Client
    this.client = {
      standard: client(this.config.client),
      minified: client(this.config.client, { minify: true })
    };

    // Define Socket.io
    this.socket = new socketIo.Server(this.bot.server.server, {
      path: `/${this.plugin}/socket.io`,
      cookie: false,
      transports: ['websocket', 'polling']
    });

    // Define Redis Pub
    const pubClient = redis.createClient({ url: `redis://${this.bot.config.queues.host}:${this.bot.config.queues.port}` });
    pubClient.connect();

    // Define Redis Sub
    const subClient = pubClient.duplicate();
    subClient.connect();

    // Define Socket.io Redis Adapter
    this.socket.adapter(socketIoRedis.createAdapter(pubClient, subClient));

    // Define Socket.io connection event
    this.socket.on('connection', (socket: socketIo.Socket) => {
      const session = `${socket.handshake.query.session}`;
      socket.join(session);
      socket.on('message', async (message: any) => {
        this.bot.addIncomingMessages([{ source: `${this.plugin}`, sourceId: session, target: `${this.config.target}`, ...message }]);
      });
      socket.on('disconnect', () => {
        const timeout = this.config.timeout || 0;
        setTimeout(async () => {
          const sockets = await this.socket.in(session).allSockets();
          if (sockets.size === 0 && timeout > 0) {
            this.bot.addIncomingMessages([{ source: `${this.plugin}`, sourceId: session, target: `${this.config.target}`, action: 'waiting' }]);
          }
        }, 100);
        setTimeout(async () => {
          const sockets = await this.socket.in(session).allSockets();
          if (sockets.size === 0) {
            this.bot.addIncomingMessages([{ source: `${this.plugin}`, sourceId: session, target: `${this.config.target}`, action: 'disconnect' }]);
          }
        }, 500 + timeout);
      });
    });
  }

  /**
   * Dispatch outgoing message
   */
  override async dispatchOutgoingMessage(message: Message): Promise<any> {
    await this.socket.to(`${message.sourceId}`).emit('message', message.toObject());
  }
}
