(function () {
  'use strict';

  // Publicspaces controller
  angular
    .module('publicspaces')
    .controller('PublicspacesController', PublicspacesController);

  PublicspacesController.$inject = ['$scope', '$state', 'Authentication', 'publicspaceResolve'];

  function PublicspacesController ($scope, $state, Authentication, publicspace) {
    var vm = this;

    vm.authentication = Authentication;
    vm.publicspace = publicspace;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Publicspace
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.publicspace.$remove($state.go('publicspaces.list'));
      }
    }

    // Save Publicspace
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.publicspaceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.publicspace._id) {
        vm.publicspace.$update(successCallback, errorCallback);
      } else {
        vm.publicspace.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('publicspaces.view', {
          publicspaceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
