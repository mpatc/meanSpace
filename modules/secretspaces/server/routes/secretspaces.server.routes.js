'use strict';

/**
 * Module dependencies
 */
var secretspacesPolicy = require('../policies/secretspaces.server.policy'),
  secretspaces = require('../controllers/secretspaces.server.controller');

module.exports = function(app) {
  // Secretspaces Routes
  app.route('/api/secretspaces').all(secretspacesPolicy.isAllowed)
    .get(secretspaces.list)
    .post(secretspaces.create);

  app.route('/api/secretspaces/:secretspaceId').all(secretspacesPolicy.isAllowed)
    .get(secretspaces.read)
    .put(secretspaces.update)
    .delete(secretspaces.delete);

  // Finish by binding the Secretspace middleware
  app.param('secretspaceId', secretspaces.secretspaceByID);
};
