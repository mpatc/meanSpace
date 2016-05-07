(function () {
  'use strict';

  // Public boards controller
  angular
    .module('public-boards')
    .controller('PublicBoardsController', PublicBoardsController);

  PublicBoardsController.$inject = ['$scope', '$state', 'Authentication', 'publicBoardResolve'];

  function PublicBoardsController ($scope, $state, Authentication, publicBoard) {
    var vm = this;

    vm.authentication = Authentication;
    vm.publicBoard = publicBoard;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Public board
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.publicBoard.$remove($state.go('public-boards.list'));
      }
    }

    // Save Public board
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.publicBoardForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.publicBoard._id) {
        vm.publicBoard.$update(successCallback, errorCallback);
      } else {
        vm.publicBoard.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('public-boards.view', {
          publicBoardId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
