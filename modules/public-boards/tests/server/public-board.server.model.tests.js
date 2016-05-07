'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  PublicBoard = mongoose.model('PublicBoard');

/**
 * Globals
 */
var user, publicBoard;

/**
 * Unit tests
 */
describe('Public board Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      publicBoard = new PublicBoard({
        name: 'Public board Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return publicBoard.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      publicBoard.name = '';

      return publicBoard.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    PublicBoard.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
