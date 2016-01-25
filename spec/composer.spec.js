/**
 * Created by dobyeongsu on 2015. 12. 19..
 */

describe('Composer Test - ', function () {
  var Goblin = require('../lib/index');
  var jsonwebtoken = require('jsonwebtoken');

  it('Composer Module', function (done) {
    Goblin('Composer', function (G) {
      expect(G.User).toBeDefined();
      expect(G.Post).toBeDefined();
      expect(G.Club).toBeDefined();
      done();
    });
  });

  describe('User - ', function () {

    it('public method', function (done) {
      Goblin('Composer', function (G) {
        expect(G.User.signin).toBeDefined();
        expect(G.User.setToken).toBeDefined();
        expect(G.User.isLogin).toBeDefined();
        expect(G.User.login).toBeDefined();
        expect(G.User.remove).toBeDefined();
        done();
      });
    });

    it('private method', function (done) {
      Goblin('Composer', function (G) {
        expect(G.User._privateMethod).not.toBeDefined();
        done();
      });
    });

    it('signin', function (done) {
      Goblin('Composer', 'Validator', function (G) {
        var user = {
          email: 'tests@test.com',
          nick: '안녕하세요병수',
          password: 'test1234'
        };

        G.validate
          .signinUser(user)
          .then(function () {
            return G.User.signin(user);
          })
          .then(function (newUser) {
            var userJS = newUser.get({plain: true});
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

    it('signin : already signin (email)', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests0@test.com',
          nick: 'newNick',
          password: 'test1234'
        };

        G.User
          .signin(user)
          .catch(function (error) {
            expect(error.name).toEqual('SequelizeUniqueConstraintError');
            expect(error.message).toEqual('Validation error');
            expect(error.errors[0].path).toEqual('email');
            done();
          });
      });
    });

    it('signin : already signin (nick)', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'newUser@test.com',
          nick: 'tests0',
          password: 'test1234'
        };

        G.User
          .signin(user)
          .catch(function (error) {
            expect(error.name).toEqual('SequelizeUniqueConstraintError');
            expect(error.message).toEqual('Validation error');
            expect(error.errors[0].path).toEqual('nick');
            done();
          });
      });
    });

    it('signin : already signin (email, nick)', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests0@test.com',
          nick: 'tests0',
          password: 'test12345'
        };

        G.User
          .signin(user)
          .catch(function (error) {
            expect(error.name).toEqual('SequelizeUniqueConstraintError');
            done();
          });
      });
    });

    it('signin : already signin (email, nick, password)', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests0@test.com',
          nick: 'tests0',
          password: 'test1234'
        };

        G.User
          .signin(user)
          .catch(function (error) {
            expect(error.name).toEqual('SequelizeUniqueConstraintError');
            expect(error.message).toEqual('Validation error');
            expect(error.errors[0].path).toEqual('email');
            done();
          });
      });
    });

    it('setToken', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests0@test.com',
          nick: 'tests0',
          password: 'test1234'
        };

        G.User
          .setToken(user)
          .then(function (token) {
            var decoded = jsonwebtoken.verify(token, 'secret');
            expect(decoded.email).toEqual(user.email);
            expect(decoded.nick).toEqual(user.nick);
            done();
          });
      });
    });

    it('setToken : undefined email', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          nick: 'tests0',
          password: 'test1234'
        };

        G.User
          .setToken(user)
          .catch(function (error) {
            expect(error.name).toEqual('ComposerError');
            done();
          });
      });
    });

    it('setToken : undefined nick', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests0@test.com',
          password: 'test1234'
        };

        G.User
          .setToken(user)
          .catch(function (error) {
            expect(error.name).toEqual('ComposerError');
            done();
          });
      });
    });

    it('setToken : undefined password', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests0@test.com',
          nick: 'tests0'
        };

        G.User
          .setToken(user)
          .catch(function (error) {
            expect(error.name).toEqual('ComposerError');
            done();
          });
      });
    });

    it('isLogin', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests0@test.com',
          nick: 'tests0',
          password: 'teset1234'
        };
        G.User
          .setToken(user)
          .then(function (token) {
            return G.User.isLogin(token);
          })
          .then(function (isLogin) {
            var loginUser = isLogin.get({plain: true});
            expect(loginUser.email).toEqual(user.email);
            expect(loginUser.nick).toEqual(user.nick);
            expect(loginUser.password).toEqual(user.password);
            done();
          });
      });
    });

    it('isLogin : invalidate token', function (done) {
      Goblin('Composer', function (G) {
        var token = 'Invalidate token';
        G.User.isLogin(token)
          .catch(function (error) {
            expect(error.name).toEqual('JsonWebTokenError');
            done();
          });
      });
    });

    it('login', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests0@test.com',
          password: 'teset1234'
        };
        G.User
          .login(user)
          .then(function (token) {
            expect(token).toEqual(jasmine.any(String));
            done();
          });
      });
    });

    it('remove', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests0@test.com',
          nick: 'tests0',
          password: 'teset1234'
        };
        G.User
          .remove(user)
          .then(function (removed) {
            expect(removed).toEqual(1);
            done();
          });
      });
    });
  });

  describe('Club - ', function () {
    it('find default club', function (done) {
      Goblin('Composer', function (G) {
        G.Club
          .findDefaults()
          .then(function (defaults) {
            expect(defaults.length).toEqual(9);
            done();
          });
      });
    });

    it('create default club', function (done) {
      Goblin('Composer', function (G) {
        var club = {
          name: 'TESTX',
          url: 'TESTX',
          description: 'TESTX',
          type: 'default',
          creator: 2
        };
        G.Club
          .createDefault(club)
          .then(function (newClub) {
            expect(newClub.get({plain: true}).name).toEqual('TESTX');

            return G.Club.findDefaults();
          })
          .then(function (defaults) {
            expect(defaults.length).toEqual(10);
            done();
          });
      });
    });

    it('find user created clubs', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests1@test.com'
        };
        G.Club
          .findUserCreated(user)
          .then(function (clubs) {
            expect(clubs.length).toEqual(2);
            done();
          });
      });
    });

    it('find user subscribed clubs', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests1@test.com'
        };
        G.Club
          .findUserSubs(user)
          .then(function (clubs) {
            expect(clubs.length).toEqual(1);
            done();
          });
      });
    });
  });

  describe('Post - ', function () {
    it('find best posts', function (done) {
      Goblin('Composer', function (G) {
        G.Post
          .findBest()
          .then(function (posts) {
            var sample = posts[0].get({plain: true});
            expect(posts.length).toEqual(18);
            expect(sample.user).toEqual(jasmine.any(Object));
            expect(sample.user.id).toEqual(jasmine.any(Number));
            expect(sample.user.nick).toEqual(jasmine.any(String));
            expect(sample.user.email).not.toBeDefined();
            done();
          });
      });
    });

    it('find posts by clubs', function (done) {
      Goblin('Composer', function (G) {
        var club = {
          url: 'game1'
        };
        G.Post
          .findPostByClub(club)
          .then(function (posts) {
            var sample = posts[0].get({plain: true});
            expect(posts.length).toEqual(1);
            expect(sample.user).toEqual(jasmine.any(Object));
            expect(sample.user.id).toEqual(jasmine.any(Number));
            expect(sample.user.nick).toEqual(jasmine.any(String));
            expect(sample.user.email).not.toBeDefined();
            done();
          });
      });
    });

    it('find posts user created', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests1@test.com'
        };
        G.Post
          .findPostUserCreated(user)
          .then(function (posts) {
            var sample = posts[0].get({plain: true});
            expect(posts.length).toEqual(2);
            expect(sample.user).toEqual(jasmine.any(Object));
            expect(sample.user.id).toEqual(jasmine.any(Number));
            expect(sample.user.nick).toEqual(jasmine.any(String));
            expect(sample.user.email).not.toBeDefined();
            done();
          });
      });
    });
  });


  describe('Vote - ', function () {
    it('Post like', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests2@test.com'
        };
        var uid = {
          uid: '1q2'
        };
        G.Post
          .like(uid, user)
          .then(function (post) {
            expect(post.get('voteCount')).toEqual(2);
            expect(post.get('likeCount')).toEqual(2);
            done();
          })
          .catch(function (e) {
            console.log(e);
            done();
          });
      });
    });

    it('Post dislike', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests2@test.com'
        };
        var uid = {
          uid: '1q3'
        };
        G.Post
          .dislike(uid, user)
          .then(function (post) {
            expect(post.get('voteCount')).toEqual(0);
            expect(post.get('likeCount')).toEqual(0);
            done();
          })
          .catch(function (e) {
            console.log(e);
            done();
          });
      });
    });

    it('Post unlike', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests2@test.com'
        };
        var uid = {
          uid: '1q2'
        };
        G.Post
          .unlike(uid, user)
          .then(function (post) {
            expect(post.get({plain: true}).voteCount).toEqual(1);
            expect(post.get({plain: true}).likeCount).toEqual(1);
            done();
          })
          .catch(function (e) {
            console.log(e);
            done();
          });
      });
    });

    it('Post undislike', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests2@test.com'
        };
        var uid = {
          uid: '1q3'
        };
        G.Post
          .undislike(uid, user)
          .then(function (post) {
            expect(post.get('voteCount')).toEqual(1);
            expect(post.get('likeCount')).toEqual(1);
            done();
          })
          .catch(function (e) {
            console.log(e);
            done();
          });
      });
    });
  });

  describe('Comment - ', function () {

    it('find one post', function (done) {
      done();
    });
  });
});
