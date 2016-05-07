'use strict';

describe('Publicspaces E2E Tests:', function () {
  describe('Test Publicspaces page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/publicspaces');
      expect(element.all(by.repeater('publicspace in publicspaces')).count()).toEqual(0);
    });
  });
});
