'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Publicspace = mongoose.model('Publicspace'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Publicspace
 */
exports.create = function(req, res) {
  var publicspace = new Publicspace(req.body);
  publicspace.user = req.user;

  publicspace.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(publicspace);
    }
  });
};

/**
 * Show the current Publicspace
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var publicspace = req.publicspace ? req.publicspace.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  publicspace.isCurrentUserOwner = req.user && publicspace.user && publicspace.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(publicspace);
};

/**
 * Update a Publicspace
 */
exports.update = function(req, res) {
  var publicspace = req.publicspace ;

  publicspace = _.extend(publicspace , req.body);

  publicspace.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(publicspace);
    }
  });
};

/**
 * Delete an Publicspace
 */
exports.delete = function(req, res) {
  var publicspace = req.publicspace ;

  publicspace.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(publicspace);
    }
  });
};

/**
 * List of Publicspaces
 */
exports.list = function(req, res) { 
  Publicspace.find().sort('-created').populate('user', 'displayName').exec(function(err, publicspaces) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(publicspaces);
    }
  });
};

/**
 * Publicspace middleware
 */
exports.publicspaceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Publicspace is invalid'
    });
  }

  Publicspace.findById(id).populate('user', 'displayName').exec(function (err, publicspace) {
    if (err) {
      return next(err);
    } else if (!publicspace) {
      return res.status(404).send({
        message: 'No Publicspace with that identifier has been found'
      });
    }
    req.publicspace = publicspace;
    next();
  });
};
