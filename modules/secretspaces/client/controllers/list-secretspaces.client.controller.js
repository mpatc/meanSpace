(function () {
  'use strict';

  angular
    .module('secretspaces')
    .controller('SecretspacesListController', SecretspacesListController);

  SecretspacesListController.$inject = ['SecretspacesService'];

  function SecretspacesListController(SecretspacesService) {
    var vm = this;

    vm.secretspaces = SecretspacesService.query();
  }
})();
