(function () {
  'use strict';

  angular
    .module('publicspaces')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('publicspaces', {
        abstract: true,
        url: '/publicspaces',
        template: '<ui-view/>'
      })
      .state('publicspaces.list', {
        url: '',
        templateUrl: 'modules/publicspaces/client/views/list-publicspaces.client.view.html',
        controller: 'PublicspacesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Publicspaces List'
        }
      })
      .state('publicspaces.create', {
        url: '/create',
        templateUrl: 'modules/publicspaces/client/views/form-publicspace.client.view.html',
        controller: 'PublicspacesController',
        controllerAs: 'vm',
        resolve: {
          publicspaceResolve: newPublicspace
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Publicspaces Create'
        }
      })
      .state('publicspaces.edit', {
        url: '/:publicspaceId/edit',
        templateUrl: 'modules/publicspaces/client/views/form-publicspace.client.view.html',
        controller: 'PublicspacesController',
        controllerAs: 'vm',
        resolve: {
          publicspaceResolve: getPublicspace
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Publicspace {{ publicspaceResolve.name }}'
        }
      })
      .state('publicspaces.view', {
        url: '/:publicspaceId',
        templateUrl: 'modules/publicspaces/client/views/view-publicspace.client.view.html',
        controller: 'PublicspacesController',
        controllerAs: 'vm',
        resolve: {
          publicspaceResolve: getPublicspace
        },
        data:{
          pageTitle: 'Publicspace {{ articleResolve.name }}'
        }
      });
  }

  getPublicspace.$inject = ['$stateParams', 'PublicspacesService'];

  function getPublicspace($stateParams, PublicspacesService) {
    return PublicspacesService.get({
      publicspaceId: $stateParams.publicspaceId
    }).$promise;
  }

  newPublicspace.$inject = ['PublicspacesService'];

  function newPublicspace(PublicspacesService) {
    return new PublicspacesService();
  }
})();
