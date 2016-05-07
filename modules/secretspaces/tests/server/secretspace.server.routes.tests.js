'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Secretspace = mongoose.model('Secretspace'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, secretspace;

/**
 * Secretspace routes tests
 */
describe('Secretspace CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Secretspace
    user.save(function () {
      secretspace = {
        name: 'Secretspace name'
      };

      done();
    });
  });

  it('should be able to save a Secretspace if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Secretspace
        agent.post('/api/secretspaces')
          .send(secretspace)
          .expect(200)
          .end(function (secretspaceSaveErr, secretspaceSaveRes) {
            // Handle Secretspace save error
            if (secretspaceSaveErr) {
              return done(secretspaceSaveErr);
            }

            // Get a list of Secretspaces
            agent.get('/api/secretspaces')
              .end(function (secretspacesGetErr, secretspacesGetRes) {
                // Handle Secretspace save error
                if (secretspacesGetErr) {
                  return done(secretspacesGetErr);
                }

                // Get Secretspaces list
                var secretspaces = secretspacesGetRes.body;

                // Set assertions
                (secretspaces[0].user._id).should.equal(userId);
                (secretspaces[0].name).should.match('Secretspace name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Secretspace if not logged in', function (done) {
    agent.post('/api/secretspaces')
      .send(secretspace)
      .expect(403)
      .end(function (secretspaceSaveErr, secretspaceSaveRes) {
        // Call the assertion callback
        done(secretspaceSaveErr);
      });
  });

  it('should not be able to save an Secretspace if no name is provided', function (done) {
    // Invalidate name field
    secretspace.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Secretspace
        agent.post('/api/secretspaces')
          .send(secretspace)
          .expect(400)
          .end(function (secretspaceSaveErr, secretspaceSaveRes) {
            // Set message assertion
            (secretspaceSaveRes.body.message).should.match('Please fill Secretspace name');

            // Handle Secretspace save error
            done(secretspaceSaveErr);
          });
      });
  });

  it('should be able to update an Secretspace if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Secretspace
        agent.post('/api/secretspaces')
          .send(secretspace)
          .expect(200)
          .end(function (secretspaceSaveErr, secretspaceSaveRes) {
            // Handle Secretspace save error
            if (secretspaceSaveErr) {
              return done(secretspaceSaveErr);
            }

            // Update Secretspace name
            secretspace.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Secretspace
            agent.put('/api/secretspaces/' + secretspaceSaveRes.body._id)
              .send(secretspace)
              .expect(200)
              .end(function (secretspaceUpdateErr, secretspaceUpdateRes) {
                // Handle Secretspace update error
                if (secretspaceUpdateErr) {
                  return done(secretspaceUpdateErr);
                }

                // Set assertions
                (secretspaceUpdateRes.body._id).should.equal(secretspaceSaveRes.body._id);
                (secretspaceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Secretspaces if not signed in', function (done) {
    // Create new Secretspace model instance
    var secretspaceObj = new Secretspace(secretspace);

    // Save the secretspace
    secretspaceObj.save(function () {
      // Request Secretspaces
      request(app).get('/api/secretspaces')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Secretspace if not signed in', function (done) {
    // Create new Secretspace model instance
    var secretspaceObj = new Secretspace(secretspace);

    // Save the Secretspace
    secretspaceObj.save(function () {
      request(app).get('/api/secretspaces/' + secretspaceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', secretspace.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Secretspace with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/secretspaces/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Secretspace is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Secretspace which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Secretspace
    request(app).get('/api/secretspaces/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Secretspace with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Secretspace if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Secretspace
        agent.post('/api/secretspaces')
          .send(secretspace)
          .expect(200)
          .end(function (secretspaceSaveErr, secretspaceSaveRes) {
            // Handle Secretspace save error
            if (secretspaceSaveErr) {
              return done(secretspaceSaveErr);
            }

            // Delete an existing Secretspace
            agent.delete('/api/secretspaces/' + secretspaceSaveRes.body._id)
              .send(secretspace)
              .expect(200)
              .end(function (secretspaceDeleteErr, secretspaceDeleteRes) {
                // Handle secretspace error error
                if (secretspaceDeleteErr) {
                  return done(secretspaceDeleteErr);
                }

                // Set assertions
                (secretspaceDeleteRes.body._id).should.equal(secretspaceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Secretspace if not signed in', function (done) {
    // Set Secretspace user
    secretspace.user = user;

    // Create new Secretspace model instance
    var secretspaceObj = new Secretspace(secretspace);

    // Save the Secretspace
    secretspaceObj.save(function () {
      // Try deleting Secretspace
      request(app).delete('/api/secretspaces/' + secretspaceObj._id)
        .expect(403)
        .end(function (secretspaceDeleteErr, secretspaceDeleteRes) {
          // Set message assertion
          (secretspaceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Secretspace error error
          done(secretspaceDeleteErr);
        });

    });
  });

  it('should be able to get a single Secretspace that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Secretspace
          agent.post('/api/secretspaces')
            .send(secretspace)
            .expect(200)
            .end(function (secretspaceSaveErr, secretspaceSaveRes) {
              // Handle Secretspace save error
              if (secretspaceSaveErr) {
                return done(secretspaceSaveErr);
              }

              // Set assertions on new Secretspace
              (secretspaceSaveRes.body.name).should.equal(secretspace.name);
              should.exist(secretspaceSaveRes.body.user);
              should.equal(secretspaceSaveRes.body.user._id, orphanId);

              // force the Secretspace to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Secretspace
                    agent.get('/api/secretspaces/' + secretspaceSaveRes.body._id)
                      .expect(200)
                      .end(function (secretspaceInfoErr, secretspaceInfoRes) {
                        // Handle Secretspace error
                        if (secretspaceInfoErr) {
                          return done(secretspaceInfoErr);
                        }

                        // Set assertions
                        (secretspaceInfoRes.body._id).should.equal(secretspaceSaveRes.body._id);
                        (secretspaceInfoRes.body.name).should.equal(secretspace.name);
                        should.equal(secretspaceInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Secretspace.remove().exec(done);
    });
  });
});
