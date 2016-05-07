//Secretspaces service used to communicate Secretspaces REST endpoints
(function () {
  'use strict';

  angular
    .module('secretspaces')
    .factory('SecretspacesService', SecretspacesService);

  SecretspacesService.$inject = ['$resource'];

  function SecretspacesService($resource) {
    return $resource('api/secretspaces/:secretspaceId', {
      secretspaceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
