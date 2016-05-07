(function () {
  'use strict';

  angular
    .module('publicspaces')
    .controller('PublicspacesListController', PublicspacesListController);

  PublicspacesListController.$inject = ['PublicspacesService'];

  function PublicspacesListController(PublicspacesService) {
    var vm = this;

    vm.publicspaces = PublicspacesService.query();
  }
})();
