/**
 * Created by dobyeongsu on 2015. 12. 19..
 */

describe('Composer Test - Point', function () {
  var Goblin = require('../lib/index');
  var assign = require('object-assign');
  var user = require('./helpers/data.json').user;
  var defaultClub = require('./helpers/data.json').club.default;
  var createdClub = require('./helpers/data.json').club.create;

  var Model = require('../db/index');
  var Point = Model.point;
  var PointLog = Model.point_log;

  it('Composer Module', function (done) {
    Goblin('Composer', 'Validator', function (G) {
      expect(G.User.findOneByUser).toBeDefined();
      expect(G.User.signin).toBeDefined();
      expect(G.User.setToken).toBeDefined();
      expect(G.User.isLogin).toBeDefined();
      expect(G.User.needLogin).toBeDefined();
      expect(G.User.login).toBeDefined();
      expect(G.User.removeOneByUser).toBeDefined();
      done();
    });
  });


  describe('Point - ', function () {
    beforeAll(function (done) {
      Goblin('Composer', 'Validator', function (G) {
        var signUser = {
          email: user.email,
          nick: user.nick,
          password: user.password
        };
        G.validate
          .signinUser(signUser)
          .then(function () {
            return G.User.signin(user);
          })
          .then(function (result) {
            user = signUser;
            user.id = result.user.get('id');

            return G.Club.createDefault(defaultClub, result.user)
              .then(function () {
                return G.Club.createClub(createdClub, result.user);
              });
          })
          .then(function () {
            return G.Club.findUserCreated(user);
          })
          .then(function (clubs) {
            expect(clubs.length).toEqual(2);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    it('create post', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };
        G.Point
          .createPost(u)
          .then(function (logs) {
            expect(logs.length).toEqual(1);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    it('create comment', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };
        G.Point
          .createComment(u)
          .then(function (logs) {
            expect(logs.length).toEqual(2);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    it('remove post', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };
        G.Point
          .removePost(u)
          .then(function (logs) {
            expect(logs.length).toEqual(3);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    it('remove comment', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };
        G.Point
          .removeComment(u)
          .then(function (logs) {
            expect(logs.length).toEqual(4);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    afterAll(function (done) {
      Goblin('Composer', 'Validator', function (G) {
        G.User
          .removeOneByUser(user)
          .then(function (removed) {
            expect(removed).toEqual(1);
            done();
          });
      });
    });
  });
});
