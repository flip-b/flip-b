export const Config: any = {
  router: {
    compression: {},
    cors: {},
    json: {},
    urlencoded: { extended: true }
  },
  server: {
    host: '127.0.0.1',
    port: '8080'
  },
  queues: {
    host: '127.0.0.1',
    port: '6379'
  },
  global: {
    name: 'Bot'
  },
  plugin: {
    chat: {
      target: 'tags',
      client: {
        //styles: { radius: 0 },
        //colors: { button_bg: '#ff8800' },
        //button: { quit_button: false },
        //dialog: { quit_button: false, emojis: false, attach: false, camera: false, dictate: false }
      },
      timeout: 15000
    },
    tags: {
      hello: ['Hola', 'Holis']
    }
  }
};
