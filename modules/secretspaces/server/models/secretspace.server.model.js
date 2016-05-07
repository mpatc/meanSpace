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
function getMissingNumbers(numbers) {
var list = [0,1,2,3,4,5,6,7,8,9];
for (var i = 0; i < numbers.length; i++) {
    for (var j = 0; j < list.length; j++) {
        if (numbers[i] === list[j]) {
            list.splice(j, 1);
}
}
}
    return list;
}
