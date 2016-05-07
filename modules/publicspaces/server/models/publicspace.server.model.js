'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Publicspace Schema
 */
var PublicspaceSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Publicspace name',
    trim: true
  },
  shout: {
    type: String,
    default: '',
    required: 'You gotta say something?!',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Publicspace', PublicspaceSchema);
