'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  PublicBoard = mongoose.model('PublicBoard'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, publicBoard;

/**
 * Public board routes tests
 */
describe('Public board CRUD tests', function () {

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

    // Save a user to the test db and create new Public board
    user.save(function () {
      publicBoard = {
        name: 'Public board name'
      };

      done();
    });
  });

  it('should be able to save a Public board if logged in', function (done) {
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

        // Save a new Public board
        agent.post('/api/publicBoards')
          .send(publicBoard)
          .expect(200)
          .end(function (publicBoardSaveErr, publicBoardSaveRes) {
            // Handle Public board save error
            if (publicBoardSaveErr) {
              return done(publicBoardSaveErr);
            }

            // Get a list of Public boards
            agent.get('/api/publicBoards')
              .end(function (publicBoardsGetErr, publicBoardsGetRes) {
                // Handle Public board save error
                if (publicBoardsGetErr) {
                  return done(publicBoardsGetErr);
                }

                // Get Public boards list
                var publicBoards = publicBoardsGetRes.body;

                // Set assertions
                (publicBoards[0].user._id).should.equal(userId);
                (publicBoards[0].name).should.match('Public board name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Public board if not logged in', function (done) {
    agent.post('/api/publicBoards')
      .send(publicBoard)
      .expect(403)
      .end(function (publicBoardSaveErr, publicBoardSaveRes) {
        // Call the assertion callback
        done(publicBoardSaveErr);
      });
  });

  it('should not be able to save an Public board if no name is provided', function (done) {
    // Invalidate name field
    publicBoard.name = '';

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

        // Save a new Public board
        agent.post('/api/publicBoards')
          .send(publicBoard)
          .expect(400)
          .end(function (publicBoardSaveErr, publicBoardSaveRes) {
            // Set message assertion
            (publicBoardSaveRes.body.message).should.match('Please fill Public board name');

            // Handle Public board save error
            done(publicBoardSaveErr);
          });
      });
  });

  it('should be able to update an Public board if signed in', function (done) {
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

        // Save a new Public board
        agent.post('/api/publicBoards')
          .send(publicBoard)
          .expect(200)
          .end(function (publicBoardSaveErr, publicBoardSaveRes) {
            // Handle Public board save error
            if (publicBoardSaveErr) {
              return done(publicBoardSaveErr);
            }

            // Update Public board name
            publicBoard.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Public board
            agent.put('/api/publicBoards/' + publicBoardSaveRes.body._id)
              .send(publicBoard)
              .expect(200)
              .end(function (publicBoardUpdateErr, publicBoardUpdateRes) {
                // Handle Public board update error
                if (publicBoardUpdateErr) {
                  return done(publicBoardUpdateErr);
                }

                // Set assertions
                (publicBoardUpdateRes.body._id).should.equal(publicBoardSaveRes.body._id);
                (publicBoardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Public boards if not signed in', function (done) {
    // Create new Public board model instance
    var publicBoardObj = new PublicBoard(publicBoard);

    // Save the publicBoard
    publicBoardObj.save(function () {
      // Request Public boards
      request(app).get('/api/publicBoards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Public board if not signed in', function (done) {
    // Create new Public board model instance
    var publicBoardObj = new PublicBoard(publicBoard);

    // Save the Public board
    publicBoardObj.save(function () {
      request(app).get('/api/publicBoards/' + publicBoardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', publicBoard.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Public board with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/publicBoards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Public board is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Public board which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Public board
    request(app).get('/api/publicBoards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Public board with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Public board if signed in', function (done) {
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

        // Save a new Public board
        agent.post('/api/publicBoards')
          .send(publicBoard)
          .expect(200)
          .end(function (publicBoardSaveErr, publicBoardSaveRes) {
            // Handle Public board save error
            if (publicBoardSaveErr) {
              return done(publicBoardSaveErr);
            }

            // Delete an existing Public board
            agent.delete('/api/publicBoards/' + publicBoardSaveRes.body._id)
              .send(publicBoard)
              .expect(200)
              .end(function (publicBoardDeleteErr, publicBoardDeleteRes) {
                // Handle publicBoard error error
                if (publicBoardDeleteErr) {
                  return done(publicBoardDeleteErr);
                }

                // Set assertions
                (publicBoardDeleteRes.body._id).should.equal(publicBoardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Public board if not signed in', function (done) {
    // Set Public board user
    publicBoard.user = user;

    // Create new Public board model instance
    var publicBoardObj = new PublicBoard(publicBoard);

    // Save the Public board
    publicBoardObj.save(function () {
      // Try deleting Public board
      request(app).delete('/api/publicBoards/' + publicBoardObj._id)
        .expect(403)
        .end(function (publicBoardDeleteErr, publicBoardDeleteRes) {
          // Set message assertion
          (publicBoardDeleteRes.body.message).should.match('User is not authorized');

          // Handle Public board error error
          done(publicBoardDeleteErr);
        });

    });
  });

  it('should be able to get a single Public board that has an orphaned user reference', function (done) {
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

          // Save a new Public board
          agent.post('/api/publicBoards')
            .send(publicBoard)
            .expect(200)
            .end(function (publicBoardSaveErr, publicBoardSaveRes) {
              // Handle Public board save error
              if (publicBoardSaveErr) {
                return done(publicBoardSaveErr);
              }

              // Set assertions on new Public board
              (publicBoardSaveRes.body.name).should.equal(publicBoard.name);
              should.exist(publicBoardSaveRes.body.user);
              should.equal(publicBoardSaveRes.body.user._id, orphanId);

              // force the Public board to have an orphaned user reference
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

                    // Get the Public board
                    agent.get('/api/publicBoards/' + publicBoardSaveRes.body._id)
                      .expect(200)
                      .end(function (publicBoardInfoErr, publicBoardInfoRes) {
                        // Handle Public board error
                        if (publicBoardInfoErr) {
                          return done(publicBoardInfoErr);
                        }

                        // Set assertions
                        (publicBoardInfoRes.body._id).should.equal(publicBoardSaveRes.body._id);
                        (publicBoardInfoRes.body.name).should.equal(publicBoard.name);
                        should.equal(publicBoardInfoRes.body.user, undefined);

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
      PublicBoard.remove().exec(done);
    });
  });
});
