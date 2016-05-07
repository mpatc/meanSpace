'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Secretspace Schema
 */
var SecretspaceSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Secretspace name',
    trim: true
  },
  whisper: {
    type: String,
    default: '',
    required: 'Pssst! Whisper us a secret!',
    trim: true
  },
  friends: {
    type: String,
    default: '',
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

mongoose.model('Secretspace', SecretspaceSchema);
