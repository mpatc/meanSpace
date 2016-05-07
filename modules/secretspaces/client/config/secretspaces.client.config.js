(function () {
  'use strict';

  angular
    .module('secretspaces')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Secretspaces',
      state: 'secretspaces',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'secretspaces', {
      title: 'List Secretspaces',
      state: 'secretspaces.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'secretspaces', {
      title: 'Create Secretspace',
      state: 'secretspaces.create',
      roles: ['user']
    });
  }
})();
