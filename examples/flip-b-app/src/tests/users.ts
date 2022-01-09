import { App } from '@flip-b/app';

describe('Users', () => {
  const app = new App();

  beforeAll(async () => {
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('Search', async () => {
    app.controllers.users.search().expect(200);
  });
});
