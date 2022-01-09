import { Bot, Message } from '@flip-b/bot';
import { ChatPlugin } from '@flip-b/bot-plugin-chat';
import { TagsPlugin } from '@flip-b/bot-plugin-tags';
import { Config } from './config';

const bot: Bot = new Bot(Config);
bot.plugin('chat', ChatPlugin);
bot.plugin('tags', TagsPlugin);

const txt: any = {
  hello: '¡Hola!'
};

bot.action('default', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> action "default"`);
  return [{ text: `No logro entender tu consulta. ¿Me explicás de nuevo por favor?` }];
});

bot.action('welcome', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> action "welcome"`);
  return [{ text: `¡Hola! Soy <strong>${bot.config.global.name}</strong>. ¿En qué te puedo ayudar?` }];
});

bot.action('connect', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> action "connect"`);
  return [];
});

bot.action('talking', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> action "talking"`);
  return [];
});

bot.action('silence', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> action "silence"`);
  return [];
});

bot.action('waiting', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> action "waiting"`);
  return [];
});

bot.action('disconnect', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> action "disconnect"`);
  return [];
});

bot.intent('hello', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> intent "hello"`);
  return [{ text: `${txt.hello}` }];
});

bot.intent('text', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> intent "text"`);
  return [{ text: `Intención "text".` }];
});

bot.intent('file', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> intent "file"`);
  return [{ text: `Intención "file".`, file: `https://picsum.photos/254.jpg` }];
});

bot.intent('menu', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> intent "menu"`);
  return [{ text: `Intención "menu".`, menu: [{ text: 'text' }, { text: 'file' }, { text: 'menu' }] }];
});

bot.intent('form', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> intent "form"`);
  const form: any = [
    { type: 'text', text: 'Ingresá tu nombre', data: 'name', attr: { required: true } },
    { type: 'email', text: 'Ingresá tu e-mail', data: 'email', attr: { required: true } },
    { type: 'submit', text: 'Enviar' }
  ];
  return [{ form: form }];
});

bot.intent('data', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> intent "data"`);
  if (message.getDataValueByIndex('name') && message.getDataValueByIndex('email')) {
    return [{ text: `Hola <strong>${message.getDataValueByIndex('name')}</strong>, tu email es ${message.getDataValueByIndex('email')}` }];
  }
});

bot.intent('call', async (message: Message): Promise<any> => {
  bot.debug(`- "${message.source}" -> intent "call"`);
  await bot.call('text', message);
  await bot.call('file', message);
  await bot.call('menu', message);
  return [{ action: 'none' }];
});

// Send
// http://localhost:8081/send/chat/b59f9e0e-cc24-449b-b6ed-e8e8c61cd301?index=text&value=¡Hola, cómo va!
// http://localhost:8081/send/chat/b59f9e0e-cc24-449b-b6ed-e8e8c61cd301?index=action&value=hide_dialog
// http://localhost:8081/send/chat/b59f9e0e-cc24-449b-b6ed-e8e8c61cd301?index=action&value=show_dialog
bot.server.router.get(`/send/:source/:sourceId`, (req: any, res: any) => {
  bot.addOutgoingMessages([{ source: req.params.source, sourceId: req.params.sourceId, [req.query.index]: req.query.value }]);
  res.send({ status: true });
});

// Text
// http://localhost:8081/text?index=hello&value=¡Hola amigo!
bot.server.router.get(`/text`, (req: any, res: any) => {
  txt[`${req.query.index}`] = `${req.query.value}`;
  res.send({ status: true });
});

bot.start();
