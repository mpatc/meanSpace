(function () {
  'use strict';

  // Secretspaces controller
  angular
    .module('secretspaces')
    .controller('SecretspacesController', SecretspacesController);

  SecretspacesController.$inject = ['$scope', '$state', 'Authentication', 'secretspaceResolve'];

  function SecretspacesController ($scope, $state, Authentication, secretspace) {
    var vm = this;

    vm.authentication = Authentication;
    vm.secretspace = secretspace;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Secretspace
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.secretspace.$remove($state.go('secretspaces.list'));
      }
    }

    // Save Secretspace
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.secretspaceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.secretspace._id) {
        vm.secretspace.$update(successCallback, errorCallback);
      } else {
        vm.secretspace.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('secretspaces.view', {
          secretspaceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
