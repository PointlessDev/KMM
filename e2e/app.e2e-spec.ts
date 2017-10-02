import { KMMPage } from './app.po';

describe('kmm App', () => {
  let page: KMMPage;

  beforeEach(() => {
    page = new KMMPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
