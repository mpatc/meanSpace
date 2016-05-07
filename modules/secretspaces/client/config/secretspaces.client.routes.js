(function () {
  'use strict';

  angular
    .module('secretspaces')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('secretspaces', {
        abstract: true,
        url: '/secretspaces',
        template: '<ui-view/>'
      })
      .state('secretspaces.list', {
        url: '',
        templateUrl: 'modules/secretspaces/client/views/list-secretspaces.client.view.html',
        controller: 'SecretspacesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Secretspaces List'
        }
      })
      .state('secretspaces.create', {
        url: '/create',
        templateUrl: 'modules/secretspaces/client/views/form-secretspace.client.view.html',
        controller: 'SecretspacesController',
        controllerAs: 'vm',
        resolve: {
          secretspaceResolve: newSecretspace
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Secretspaces Create'
        }
      })
      .state('secretspaces.edit', {
        url: '/:secretspaceId/edit',
        templateUrl: 'modules/secretspaces/client/views/form-secretspace.client.view.html',
        controller: 'SecretspacesController',
        controllerAs: 'vm',
        resolve: {
          secretspaceResolve: getSecretspace
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Secretspace {{ secretspaceResolve.name }}'
        }
      })
      .state('secretspaces.view', {
        url: '/:secretspaceId',
        templateUrl: 'modules/secretspaces/client/views/view-secretspace.client.view.html',
        controller: 'SecretspacesController',
        controllerAs: 'vm',
        resolve: {
          secretspaceResolve: getSecretspace
        },
        data:{
          pageTitle: 'Secretspace {{ articleResolve.name }}'
        }
      });
  }

  getSecretspace.$inject = ['$stateParams', 'SecretspacesService'];

  function getSecretspace($stateParams, SecretspacesService) {
    return SecretspacesService.get({
      secretspaceId: $stateParams.secretspaceId
    }).$promise;
  }

  newSecretspace.$inject = ['SecretspacesService'];

  function newSecretspace(SecretspacesService) {
    return new SecretspacesService();
  }
})();
