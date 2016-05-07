'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Secretspace = mongoose.model('Secretspace');

/**
 * Globals
 */
var user, secretspace;

/**
 * Unit tests
 */
describe('Secretspace Model Unit Tests:', function() {
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
      secretspace = new Secretspace({
        name: 'Secretspace Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return secretspace.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      secretspace.name = '';

      return secretspace.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Secretspace.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
