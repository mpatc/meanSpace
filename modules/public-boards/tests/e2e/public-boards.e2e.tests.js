'use strict';

describe('Public boards E2E Tests:', function () {
  describe('Test Public boards page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/public-boards');
      expect(element.all(by.repeater('public-board in public-boards')).count()).toEqual(0);
    });
  });
});
