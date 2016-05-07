'use strict';

describe('Secretspaces E2E Tests:', function () {
  describe('Test Secretspaces page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/secretspaces');
      expect(element.all(by.repeater('secretspace in secretspaces')).count()).toEqual(0);
    });
  });
});
