'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Public board Schema
 */
var PublicBoardSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Public board name',
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

mongoose.model('PublicBoard', PublicBoardSchema);
