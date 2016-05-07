'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Secretspaces Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/secretspaces',
      permissions: '*'
    }, {
      resources: '/api/secretspaces/:secretspaceId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/secretspaces',
      permissions: ['get', 'post']
    }, {
      resources: '/api/secretspaces/:secretspaceId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/secretspaces',
      permissions: ['get']
    }, {
      resources: '/api/secretspaces/:secretspaceId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Secretspaces Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Secretspace is being processed and the current user created it then allow any manipulation
  if (req.secretspace && req.user && req.secretspace.user && req.secretspace.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
