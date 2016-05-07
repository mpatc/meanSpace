(function () {
  'use strict';

  angular
    .module('public-boards')
    .controller('PublicBoardsListController', PublicBoardsListController);

  PublicBoardsListController.$inject = ['PublicBoardsService'];

  function PublicBoardsListController(PublicBoardsService) {
    var vm = this;

    vm.publicBoards = PublicBoardsService.query();
  }
})();
