//Public boards service used to communicate Public boards REST endpoints
(function () {
  'use strict';

  angular
    .module('public-boards')
    .factory('PublicBoardsService', PublicBoardsService);

  PublicBoardsService.$inject = ['$resource'];

  function PublicBoardsService($resource) {
    return $resource('api/public-boards/:publicBoardId', {
      publicBoardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
