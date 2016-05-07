'use strict';

/**
 * Module dependencies
 */
var publicspacesPolicy = require('../policies/publicspaces.server.policy'),
  publicspaces = require('../controllers/publicspaces.server.controller');

module.exports = function(app) {
  // Publicspaces Routes
  app.route('/api/publicspaces').all(publicspacesPolicy.isAllowed)
    .get(publicspaces.list)
    .post(publicspaces.create);

  app.route('/api/publicspaces/:publicspaceId').all(publicspacesPolicy.isAllowed)
    .get(publicspaces.read)
    .put(publicspaces.update)
    .delete(publicspaces.delete);

  // Finish by binding the Publicspace middleware
  app.param('publicspaceId', publicspaces.publicspaceByID);
};
