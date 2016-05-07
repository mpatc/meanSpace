(function () {
  'use strict';

  angular
    .module('publicspaces')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Publicspaces',
      state: 'publicspaces',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'publicspaces', {
      title: 'List Publicspaces',
      state: 'publicspaces.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'publicspaces', {
      title: 'Create Publicspace',
      state: 'publicspaces.create',
      roles: ['user']
    });
  }
})();
