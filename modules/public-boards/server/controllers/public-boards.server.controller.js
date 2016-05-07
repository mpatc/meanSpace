'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  PublicBoard = mongoose.model('PublicBoard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Public board
 */
exports.create = function(req, res) {
  var publicBoard = new PublicBoard(req.body);
  publicBoard.user = req.user;

  publicBoard.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(publicBoard);
    }
  });
};

/**
 * Show the current Public board
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var publicBoard = req.publicBoard ? req.publicBoard.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  publicBoard.isCurrentUserOwner = req.user && publicBoard.user && publicBoard.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(publicBoard);
};

/**
 * Update a Public board
 */
exports.update = function(req, res) {
  var publicBoard = req.publicBoard ;

  publicBoard = _.extend(publicBoard , req.body);

  publicBoard.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(publicBoard);
    }
  });
};

/**
 * Delete an Public board
 */
exports.delete = function(req, res) {
  var publicBoard = req.publicBoard ;

  publicBoard.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(publicBoard);
    }
  });
};

/**
 * List of Public boards
 */
exports.list = function(req, res) { 
  PublicBoard.find().sort('-created').populate('user', 'displayName').exec(function(err, publicBoards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(publicBoards);
    }
  });
};

/**
 * Public board middleware
 */
exports.publicBoardByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Public board is invalid'
    });
  }

  PublicBoard.findById(id).populate('user', 'displayName').exec(function (err, publicBoard) {
    if (err) {
      return next(err);
    } else if (!publicBoard) {
      return res.status(404).send({
        message: 'No Public board with that identifier has been found'
      });
    }
    req.publicBoard = publicBoard;
    next();
  });
};
