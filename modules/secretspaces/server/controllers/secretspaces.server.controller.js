'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Secretspace = mongoose.model('Secretspace'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Secretspace
 */
exports.create = function(req, res) {
  var secretspace = new Secretspace(req.body);
  secretspace.user = req.user;

  secretspace.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(secretspace);
    }
  });
};

/**
 * Show the current Secretspace
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var secretspace = req.secretspace ? req.secretspace.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  secretspace.isCurrentUserOwner = req.user && secretspace.user && secretspace.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(secretspace);
};

/**
 * Update a Secretspace
 */
exports.update = function(req, res) {
  var secretspace = req.secretspace ;

  secretspace = _.extend(secretspace , req.body);

  secretspace.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(secretspace);
    }
  });
};

/**
 * Delete an Secretspace
 */
exports.delete = function(req, res) {
  var secretspace = req.secretspace ;

  secretspace.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(secretspace);
    }
  });
};

/**
 * List of Secretspaces
 */
exports.list = function(req, res) { 
  Secretspace.find().sort('-created').populate('user', 'displayName').exec(function(err, secretspaces) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(secretspaces);
    }
  });
};

/**
 * Secretspace middleware
 */
exports.secretspaceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Secretspace is invalid'
    });
  }

  Secretspace.findById(id).populate('user', 'displayName').exec(function (err, secretspace) {
    if (err) {
      return next(err);
    } else if (!secretspace) {
      return res.status(404).send({
        message: 'No Secretspace with that identifier has been found'
      });
    }
    req.secretspace = secretspace;
    next();
  });
};
