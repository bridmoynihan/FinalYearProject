import { FinalYearProjectPage } from './app.po';

describe('final-year-project App', function() {
  let page: FinalYearProjectPage;

  beforeEach(() => {
    page = new FinalYearProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
