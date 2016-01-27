/**
 * Created by dobyeongsu on 2015. 12. 19..
 */

describe('Composer Test - User', function () {
  var Goblin = require('../lib/index');

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

    it('private method', function (done) {
      Goblin('Composer', function (G) {
        expect(G.User._privateMethod).not.toBeDefined();
        done();
      });
    });

    it('signin', function (done) {
      Goblin('Composer', 'Validator', function (G) {
        var user = {
          email: 'test@test.com',
          nick: '닉네임',
          password: 'test1234'
        };

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

    it('signin : already signin (email)', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'test@test.com',
          nick: '닉네임1',
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
          email: 'test1@test.com',
          nick: '닉네임',
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
          email: 'test@test.com',
          nick: '닉네임',
          password: 'test12345'
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

    it('signin : already signin (email, nick, password)', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'test@test.com',
          nick: '닉네임',
          password: 'test1234'
        };

        G.User
          .signin(user)
          .catch(function (error) {
            expect(error.name).toEqual('ComposerError');
            expect(error.message).toEqual('Already signin User');
            done();
          });
      });
    });

    it('setToken', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'test@test.com',
          nick: '닉네임',
          password: 'test1234'
        };

        G.User
          .setToken(user)
          .then(function (token) {
            expect(token).toEqual(jasmine.any(String));
            done();
          });
      });
    });

    it('login', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'test@test.com',
          password: 'test1234'
        };
        G.User
          .login(user)
          .then(function (token) {
            expect(token).toEqual(jasmine.any(String));
            done();
          });
      });
    });

    it('isLogin', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'test@test.com',
          password: 'test1234'
        };
        var nick = '닉네임';
        G.User
          .login(user)
          .then(function (token) {
            return G.User.isLogin(token);
          })
          .then(function (isLogin) {
            var loginUser = isLogin.get({plain: true});
            expect(loginUser.email).toEqual(user.email);
            expect(loginUser.nick).toEqual(nick);
            expect(loginUser.password).toEqual(user.password);
            done();
          });
      });
    });

    it('isLogin : invalidate token', function (done) {
      Goblin('Composer', function (G) {
        var token = 'Invalidate token';
        G.User
          .isLogin(token)
          .catch(function (error) {
            expect(error.name).toEqual('JsonWebTokenError');
            expect(error.message).toEqual('jwt malformed');
            done();
          });
      });
    });

    it('needLogin', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'test@test.com',
          password: 'test1234'
        };
        G.User
          .login(user)
          .then(function (token) {
            return G.User.needLogin(token);
          })
          .then(function (loginUser) {
            expect(user.email).toEqual(loginUser.email);
            expect(user.password).toEqual(loginUser.password);
            done();
          });
      });
    });

    it('removeOneByUser', function (done) {
      Goblin('Composer', function (G) {
        var user = {
          email: 'test@test.com',
          password: 'test1234'
        };
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
