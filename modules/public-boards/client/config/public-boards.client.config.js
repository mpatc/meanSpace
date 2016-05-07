(function () {
  'use strict';

  angular
    .module('public-boards')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Public boards',
      state: 'public-boards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'public-boards', {
      title: 'List Public boards',
      state: 'public-boards.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'public-boards', {
      title: 'Create Public board',
      state: 'public-boards.create',
      roles: ['user']
    });
  }
})();
