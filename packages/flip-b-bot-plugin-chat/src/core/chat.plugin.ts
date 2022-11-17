import {Plugin, Message, Request, Response} from '@flip-b/bot';
import {getChatClientLib} from './chat.client.lib';
import {getChatClientWeb} from './chat.client.web';

/**
 * Chat plugin
 */
export class ChatPlugin extends Plugin {
  // Plugin definitions

  /**
   * Socket
   */
  socket: any;

  /**
   * Register
   */
  override async register(): Promise<any> {
    // Register

    // Define route
    this.bot.registerRoute('get', `/${this.plugin}/:origin/`, (req: Request, res: Response) => {
      try {
        const origin: any = this.bot.config.origins[`${req.params.origin || ''}`] || {};
        const config: any = origin[`${this.plugin}`] || this.bot.config.plugins[`${this.plugin}`] || undefined;
        if (!config || !config.enabled) {
          res.status(404).send();
          return;
        }
        let result: any = getChatClientWeb(config, req.query);
        result = result.replace(/_URL_/g, `${req.protocol}://${req.get('host')}`);
        result = result.replace(/_PLUGIN_/g, `${req.params.plugin || this.plugin}`);
        result = result.replace(/_ORIGIN_/g, `${req.params.origin || ''}`);
        res.status(200).send(result);
      } catch (error: any) {
        res.status(400).send();
      }
    });

    // Define route
    this.bot.registerRoute('get', `/${this.plugin}/:origin/chat.js`, (req: Request, res: Response) => {
      try {
        const origin: any = this.bot.config.origins[`${req.params.origin || ''}`] || {};
        const config: any = origin[`${this.plugin}`] || this.bot.config.plugins[`${this.plugin}`] || undefined;
        if (!config || !config.enabled) {
          res.status(404).send();
          return;
        }
        let result: any = getChatClientLib(config, req.query);
        result = result.replace(/_URL_/g, `${req.protocol}://${req.get('host')}`);
        result = result.replace(/_PLUGIN_/g, `${req.params.plugin || this.plugin}`);
        result = result.replace(/_ORIGIN_/g, `${req.params.origin || ''}`);
        res.status(200).send(result);
      } catch (error: any) {
        res.status(400).send();
      }
    });

    // Define route
    this.bot.registerRoute('get', `/${this.plugin}/:origin/chat.min.js`, (req: Request, res: Response) => {
      try {
        const origin: any = this.bot.config.origins[`${req.params.origin || ''}`] || {};
        const config: any = origin[`${this.plugin}`] || this.bot.config.plugins[`${this.plugin}`] || undefined;
        if (!config || !config.enabled) {
          res.status(404).send();
          return;
        }
        let result: any = getChatClientLib(config, req.query);
        result = result.replace(/_URL_/g, `${req.protocol}://${req.get('host')}`);
        result = result.replace(/_PLUGIN_/g, `${req.params.plugin || this.plugin}`);
        result = result.replace(/_ORIGIN_/g, `${req.params.origin || ''}`);
        result = this.bot.helper.uglifyJs.minify(result).code;
        res.status(200).send(result);
      } catch (error: any) {
        res.status(400).send();
      }
    });

    // Define socket.io
    this.socket = new this.bot.helper.socketIo.Server(this.bot.server.server, {
      path: `/${this.plugin}/socket.io`,
      cookie: false,
      transports: ['websocket', 'polling']
    });

    // Define socket.io redis adapter
    this.socket.adapter(this.bot.helper.socketIoRedisAdapter.createAdapter(this.bot.pubsub.pub, this.bot.pubsub.sub));

    // Define socket.io connection event
    this.socket.on('connection', (socket: any) => {
      const plugin = `${socket.handshake.query.plugin || this.plugin}`;
      const origin = `${socket.handshake.query.origin || ''}`;
      const ticket = `${socket.handshake.query.ticket || ''}`;

      const configOrigin: any = this.bot.config.origins[`${origin || ''}`] || {};
      const configPlugin: any = configOrigin[`${plugin || ''}`] || this.bot.config.plugins[`${plugin || ''}`] || undefined;
      if (!configPlugin || !configPlugin.enabled || !plugin || !origin || !ticket) {
        return;
      }

      socket.join(`${ticket}`);
      socket.on('message', async (message: any) => {
        this.bot.addIncomingMessages([{ticket, origin, source: `${plugin}`, ...message}]);
      });
      socket.on('disconnect', () => {
        const waiting: number = parseInt(`${configPlugin.system_waiting || 30}`) * 1000;
        setTimeout(async () => {
          const sockets: any = await this.socket.in(ticket).allSockets();
          if (sockets.size === 0 && waiting > 0) {
            this.bot.addIncomingMessages([{ticket, origin, source: `${plugin}`, action: 'waiting'}]);
          }
        }, 100);
        setTimeout(async () => {
          const sockets: any = await this.socket.in(ticket).allSockets();
          if (sockets.size === 0) {
            this.bot.addIncomingMessages([{ticket, origin, source: `${plugin}`, action: 'disconnect'}]);
          }
        }, 100 + waiting);
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
