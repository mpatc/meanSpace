'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Publicspace = mongoose.model('Publicspace'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, publicspace;

/**
 * Publicspace routes tests
 */
describe('Publicspace CRUD tests', function () {

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

    // Save a user to the test db and create new Publicspace
    user.save(function () {
      publicspace = {
        name: 'Publicspace name'
      };

      done();
    });
  });

  it('should be able to save a Publicspace if logged in', function (done) {
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

        // Save a new Publicspace
        agent.post('/api/publicspaces')
          .send(publicspace)
          .expect(200)
          .end(function (publicspaceSaveErr, publicspaceSaveRes) {
            // Handle Publicspace save error
            if (publicspaceSaveErr) {
              return done(publicspaceSaveErr);
            }

            // Get a list of Publicspaces
            agent.get('/api/publicspaces')
              .end(function (publicspacesGetErr, publicspacesGetRes) {
                // Handle Publicspace save error
                if (publicspacesGetErr) {
                  return done(publicspacesGetErr);
                }

                // Get Publicspaces list
                var publicspaces = publicspacesGetRes.body;

                // Set assertions
                (publicspaces[0].user._id).should.equal(userId);
                (publicspaces[0].name).should.match('Publicspace name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Publicspace if not logged in', function (done) {
    agent.post('/api/publicspaces')
      .send(publicspace)
      .expect(403)
      .end(function (publicspaceSaveErr, publicspaceSaveRes) {
        // Call the assertion callback
        done(publicspaceSaveErr);
      });
  });

  it('should not be able to save an Publicspace if no name is provided', function (done) {
    // Invalidate name field
    publicspace.name = '';

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

        // Save a new Publicspace
        agent.post('/api/publicspaces')
          .send(publicspace)
          .expect(400)
          .end(function (publicspaceSaveErr, publicspaceSaveRes) {
            // Set message assertion
            (publicspaceSaveRes.body.message).should.match('Please fill Publicspace name');

            // Handle Publicspace save error
            done(publicspaceSaveErr);
          });
      });
  });

  it('should be able to update an Publicspace if signed in', function (done) {
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

        // Save a new Publicspace
        agent.post('/api/publicspaces')
          .send(publicspace)
          .expect(200)
          .end(function (publicspaceSaveErr, publicspaceSaveRes) {
            // Handle Publicspace save error
            if (publicspaceSaveErr) {
              return done(publicspaceSaveErr);
            }

            // Update Publicspace name
            publicspace.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Publicspace
            agent.put('/api/publicspaces/' + publicspaceSaveRes.body._id)
              .send(publicspace)
              .expect(200)
              .end(function (publicspaceUpdateErr, publicspaceUpdateRes) {
                // Handle Publicspace update error
                if (publicspaceUpdateErr) {
                  return done(publicspaceUpdateErr);
                }

                // Set assertions
                (publicspaceUpdateRes.body._id).should.equal(publicspaceSaveRes.body._id);
                (publicspaceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Publicspaces if not signed in', function (done) {
    // Create new Publicspace model instance
    var publicspaceObj = new Publicspace(publicspace);

    // Save the publicspace
    publicspaceObj.save(function () {
      // Request Publicspaces
      request(app).get('/api/publicspaces')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Publicspace if not signed in', function (done) {
    // Create new Publicspace model instance
    var publicspaceObj = new Publicspace(publicspace);

    // Save the Publicspace
    publicspaceObj.save(function () {
      request(app).get('/api/publicspaces/' + publicspaceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', publicspace.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Publicspace with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/publicspaces/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Publicspace is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Publicspace which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Publicspace
    request(app).get('/api/publicspaces/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Publicspace with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Publicspace if signed in', function (done) {
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

        // Save a new Publicspace
        agent.post('/api/publicspaces')
          .send(publicspace)
          .expect(200)
          .end(function (publicspaceSaveErr, publicspaceSaveRes) {
            // Handle Publicspace save error
            if (publicspaceSaveErr) {
              return done(publicspaceSaveErr);
            }

            // Delete an existing Publicspace
            agent.delete('/api/publicspaces/' + publicspaceSaveRes.body._id)
              .send(publicspace)
              .expect(200)
              .end(function (publicspaceDeleteErr, publicspaceDeleteRes) {
                // Handle publicspace error error
                if (publicspaceDeleteErr) {
                  return done(publicspaceDeleteErr);
                }

                // Set assertions
                (publicspaceDeleteRes.body._id).should.equal(publicspaceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Publicspace if not signed in', function (done) {
    // Set Publicspace user
    publicspace.user = user;

    // Create new Publicspace model instance
    var publicspaceObj = new Publicspace(publicspace);

    // Save the Publicspace
    publicspaceObj.save(function () {
      // Try deleting Publicspace
      request(app).delete('/api/publicspaces/' + publicspaceObj._id)
        .expect(403)
        .end(function (publicspaceDeleteErr, publicspaceDeleteRes) {
          // Set message assertion
          (publicspaceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Publicspace error error
          done(publicspaceDeleteErr);
        });

    });
  });

  it('should be able to get a single Publicspace that has an orphaned user reference', function (done) {
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

          // Save a new Publicspace
          agent.post('/api/publicspaces')
            .send(publicspace)
            .expect(200)
            .end(function (publicspaceSaveErr, publicspaceSaveRes) {
              // Handle Publicspace save error
              if (publicspaceSaveErr) {
                return done(publicspaceSaveErr);
              }

              // Set assertions on new Publicspace
              (publicspaceSaveRes.body.name).should.equal(publicspace.name);
              should.exist(publicspaceSaveRes.body.user);
              should.equal(publicspaceSaveRes.body.user._id, orphanId);

              // force the Publicspace to have an orphaned user reference
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

                    // Get the Publicspace
                    agent.get('/api/publicspaces/' + publicspaceSaveRes.body._id)
                      .expect(200)
                      .end(function (publicspaceInfoErr, publicspaceInfoRes) {
                        // Handle Publicspace error
                        if (publicspaceInfoErr) {
                          return done(publicspaceInfoErr);
                        }

                        // Set assertions
                        (publicspaceInfoRes.body._id).should.equal(publicspaceSaveRes.body._id);
                        (publicspaceInfoRes.body.name).should.equal(publicspace.name);
                        should.equal(publicspaceInfoRes.body.user, undefined);

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
      Publicspace.remove().exec(done);
    });
  });
});
