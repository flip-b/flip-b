import { App } from '@flip-b/app';

describe('Places', () => {
  const app = new App();

  beforeAll(async () => {
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('Search', async () => {
    app.controllers.places.search().expect(200);
  });
});
