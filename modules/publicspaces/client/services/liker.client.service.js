//Publicspaces service used to communicate Publicspaces REST endpoints
(function () {
  'use strict';

  angular
    .module('publicspaces')
    .factory('PublicspacesService', PublicspacesService);

  PublicspacesService.$inject = ['$resource'];

  function PublicspacesService($resource) {
    return $resource('api/publicspaces/:publicspaceId', {
      publicspaceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
