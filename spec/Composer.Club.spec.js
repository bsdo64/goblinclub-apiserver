/**
 * Created by dobyeongsu on 2015. 12. 19..
 */

describe('Composer Test - Club', function () {
  var Goblin = require('../lib/index');
  var user = require('./helpers/data.json').user;
  var club = require('./helpers/data.json').club.create;
  var defaultClub = require('./helpers/data.json').club.default;

  it('Composer Module', function (done) {
    Goblin('Composer', function (G) {
      expect(G.User).toBeDefined();
      expect(G.Post).toBeDefined();
      expect(G.Club).toBeDefined();
      done();
    });
  });

  describe('Club - ', function () {
    beforeAll(function (done) {
      Goblin('Composer', 'Validator', function (G) {
        G.validate
          .signinUser(user)
          .then(function () {
            return G.User.signin(user);
          })
          .then(function (result) {
            var userJS = result.user.get({plain: true});
            expect(result.token).toEqual(jasmine.any(String));
            expect(userJS.email).toEqual(user.email);
            expect(userJS.nick).toEqual(user.nick);
            expect(userJS.password).toEqual(user.password);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    it('public method', function (done) {
      Goblin('Composer', function (G) {
        expect(G.Club.createClub).toBeDefined();
        expect(G.Club.findAll).toBeDefined();
        expect(G.Club.findOne).toBeDefined();
        expect(G.Club.findOneByUrl).toBeDefined();
        expect(G.Club.findDefaults).toBeDefined();
        expect(G.Club.createDefault).toBeDefined();
        expect(G.Club.findUserCreated).toBeDefined();
        expect(G.Club.findUserSubs).toBeDefined();
        done();
      });
    });

    it('private method', function (done) {
      Goblin('Composer', function (G) {
        expect(G.User._privateMethod).not.toBeDefined();
        done();
      });
    });

    it('find default club', function (done) {
      Goblin('Composer', function (G) {
        G.Club
          .findDefaults()
          .then(function (defaults) {
            expect(defaults.length).toEqual(0);
            done();
          });
      });
    });

    it('create default club', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };

        G.User
          .findOneByUser(u)
          .then(function (findUser) {
            return G.Club.createDefault(defaultClub, findUser);
          })
          .then(function (createdClub) {
            var newClub = createdClub.get({plain: true});
            expect(newClub.name).toEqual(defaultClub.name);
            expect(newClub.url).toEqual(defaultClub.url);
            expect(newClub.description).toEqual(defaultClub.description);
            expect(newClub.type).toEqual('default');
            done();
          });
      });
    });

    it('create club', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };

        G.User
          .findOneByUser(u)
          .then(function (findUser) {
            return G.Club.createClub(club, findUser);
          })
          .then(function (createdClub) {
            var newClub = createdClub.get({plain: true});
            expect(newClub.name).toEqual(club.name);
            expect(newClub.url).toEqual(club.url);
            expect(newClub.description).toEqual(club.description);
            expect(newClub.type).toEqual('create');
            done();
          });
      });
    });

    it('find user created clubs', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };

        G.Club
          .findUserCreated(u)
          .then(function (clubs) {
            expect(clubs.length).toEqual(2);
            done();
          });
      });
    });

    it('find user subscribed clubs', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };

        G.Club
          .findUserSubs(u)
          .then(function (clubs) {
            // Default 는 카운트 하지 않는다
            expect(clubs.length).toEqual(1);
            done();
          });
      });
    });

    it('find all clubs', function (done) {
      Goblin('Composer', function (G) {
        G.Club
          .findAll()
          .then(function (clubs) {
            expect(clubs.length).toEqual(2);
            done();
          });
      });
    });

    it('find One By Url', function (done) {
      Goblin('Composer', function (G) {
        var url = 'testclub';
        G.Club
          .findOneByUrl(url)
          .then(function (findClub) {
            expect(findClub.get('url')).toEqual(url);
            done();
          });
      });
    });

    afterAll(function (done) {
      Goblin('Composer', 'Validator', function (G) {
        var u = {
          email: user.email
        };

        G.User
          .removeOneByUser(u)
          .then(function (removed) {
            expect(removed).toEqual(1);
            done();
          });
      });
    });
  });
});
