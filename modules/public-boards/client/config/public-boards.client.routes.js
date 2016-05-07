(function () {
  'use strict';

  angular
    .module('public-boards')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('public-boards', {
        abstract: true,
        url: '/public-boards',
        template: '<ui-view/>'
      })
      .state('public-boards.list', {
        url: '',
        templateUrl: 'modules/public-boards/client/views/list-public-boards.client.view.html',
        controller: 'PublicBoardsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Public boards List'
        }
      })
      .state('public-boards.create', {
        url: '/create',
        templateUrl: 'modules/public-boards/client/views/form-public-board.client.view.html',
        controller: 'PublicBoardsController',
        controllerAs: 'vm',
        resolve: {
          public-boardResolve: newPublicBoard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Public boards Create'
        }
      })
      .state('public-boards.edit', {
        url: '/:publicBoardId/edit',
        templateUrl: 'modules/public-boards/client/views/form-public-board.client.view.html',
        controller: 'PublicBoardsController',
        controllerAs: 'vm',
        resolve: {
          public-boardResolve: getPublicBoard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Public board {{ public-boardResolve.name }}'
        }
      })
      .state('public-boards.view', {
        url: '/:publicBoardId',
        templateUrl: 'modules/public-boards/client/views/view-public-board.client.view.html',
        controller: 'PublicBoardsController',
        controllerAs: 'vm',
        resolve: {
          public-boardResolve: getPublicBoard
        },
        data:{
          pageTitle: 'Public board {{ articleResolve.name }}'
        }
      });
  }

  getPublicBoard.$inject = ['$stateParams', 'PublicBoardsService'];

  function getPublicBoard($stateParams, PublicBoardsService) {
    return PublicBoardsService.get({
      publicBoardId: $stateParams.publicBoardId
    }).$promise;
  }

  newPublicBoard.$inject = ['PublicBoardsService'];

  function newPublicBoard(PublicBoardsService) {
    return new PublicBoardsService();
  }
})();
