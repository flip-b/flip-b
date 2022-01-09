import { App } from '@flip-b/app';

describe('Routes', () => {
  const app = new App();

  beforeAll(async () => {
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('Search', async () => {
    app.controllers.accounts.search().expect(200);
  });
});
