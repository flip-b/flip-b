import {Plugin, Message, Request, Response} from '@flip-b/bot';
import {getChatClientLib} from './chat.client.lib';
import {getChatClientWeb} from './chat.client.web';

/**
 * Chat plugin
 */
export class ChatPlugin extends Plugin {
  // Plugin definitions

  /**
   * Register
   */
  override async register(): Promise<any> {
    // Register

    // Define router event
    this.app.router.get(`/${this.plugin}/:origin/`, (req: Request, res: Response) => {
      try {
        const origin: any = this.app.config.origins[`${req.params.origin || ''}`] || {};
        const config: any = origin[`${this.plugin}`] || this.app.config.plugins[`${this.plugin}`] || undefined;
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

    // Define router event
    this.app.router.get(`/${this.plugin}/:origin/chat.js`, (req: Request, res: Response) => {
      try {
        const origin: any = this.app.config.origins[`${req.params.origin || ''}`] || {};
        const config: any = origin[`${this.plugin}`] || this.app.config.plugins[`${this.plugin}`] || undefined;
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

    // Define router event
    this.app.router.get(`/${this.plugin}/:origin/chat.min.js`, (req: Request, res: Response) => {
      try {
        const origin: any = this.app.config.origins[`${req.params.origin || ''}`] || {};
        const config: any = origin[`${this.plugin}`] || this.app.config.plugins[`${this.plugin}`] || undefined;
        if (!config || !config.enabled) {
          res.status(404).send();
          return;
        }
        let result: any = getChatClientLib(config, req.query);
        result = result.replace(/_URL_/g, `${req.protocol}://${req.get('host')}`);
        result = result.replace(/_PLUGIN_/g, `${req.params.plugin || this.plugin}`);
        result = result.replace(/_ORIGIN_/g, `${req.params.origin || ''}`);
        result = this.app.helper.uglifyJs.minify(result).code;
        res.status(200).send(result);
      } catch (error: any) {
        res.status(400).send();
      }
    });

    // Define socket event
    this.app.socket.of(`/${this.plugin}`).on('connection', (socket: any) => {
      try {
        const ticket = `${socket.handshake.query.ticket || ''}`;
        const plugin = `${socket.handshake.query.plugin || this.plugin}`;
        const origin = `${socket.handshake.query.origin || ''}`;
        const source = `${socket.handshake.query.source || this.plugin}`;
        const target = `${socket.handshake.query.target || ''}`;

        const configOrigin: any = this.app.config.origins[`${origin || ''}`] || {};
        const configPlugin: any = configOrigin[`${plugin || ''}`] || this.app.config.plugins[`${plugin || ''}`] || undefined;
        if (!configPlugin || !configPlugin.enabled || !ticket || !plugin || !origin || !source) {
          return;
        }

        socket.join(`${ticket}`);
        socket.on('message', async (message: any) => {
          this.app.queues.pushJob([{ticket, origin, source, target, type: 'incoming', ...message}]);
        });
        socket.on('disconnect', () => {
          const waiting: number = parseInt(`${configPlugin.system_waiting || 30}`) * 1000;
          setTimeout(async () => {
            const sockets: any = await this.app.socket.of(`/${this.plugin}`).in(`${ticket}`).allSockets();
            if (sockets.size === 0 && waiting > 0) {
              this.app.queues.pushJob([{ticket, origin, source, target, type: 'incoming', action: 'waiting'}]);
            }
          }, 100);
          setTimeout(async () => {
            const sockets: any = await this.app.socket.of(`/${this.plugin}`).in(`${ticket}`).allSockets();
            if (sockets.size === 0) {
              this.app.queues.pushJob([{ticket, origin, source, target, type: 'incoming', action: 'disconnect'}]);
            }
          }, 100 + waiting);
        });
      } catch (error: any) {
        console.error(`${error}`);
      }
    });
  }

  /**
   * Dispatch outgoing message
   */
  override async dispatchOutgoingMessage(message: Message): Promise<any> {
    return await this.app.socket.of(`/${this.plugin}`).to(`${message.ticket}`).emit('message', message.toObject());
  }
}
