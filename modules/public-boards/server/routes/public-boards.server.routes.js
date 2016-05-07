'use strict';

/**
 * Module dependencies
 */
var publicBoardsPolicy = require('../policies/public-boards.server.policy'),
  publicBoards = require('../controllers/public-boards.server.controller');

module.exports = function(app) {
  // Public boards Routes
  app.route('/api/public-boards').all(publicBoardsPolicy.isAllowed)
    .get(publicBoards.list)
    .post(publicBoards.create);

  app.route('/api/public-boards/:publicBoardId').all(publicBoardsPolicy.isAllowed)
    .get(publicBoards.read)
    .put(publicBoards.update)
    .delete(publicBoards.delete);

  // Finish by binding the Public board middleware
  app.param('publicBoardId', publicBoards.publicBoardByID);
};
