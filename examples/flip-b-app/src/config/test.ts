export default {
  server: {
    port: '8080',
    path: ''
  },
  router: {
    compression: {},
    cors: {},
    json: {},
    urlencoded: { extended: true },
    route: { path: '/api/v1' },
    files: { path: '/api/v1/upload' },
    mount: { path: '' },
    error: {}
  },
  database: {
    url: 'mongodb://root:toor@localhost/app?authSource=admin',
    options: {}
  },
  security: {
    secret: 's3cr3t',
    expire: '1d'
  }
};
