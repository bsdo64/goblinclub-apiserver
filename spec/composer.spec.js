/**
 * Created by dobyeongsu on 2015. 12. 19..
 */
var Goblin = require('../lib/index');
var jsonwebtoken = require('jsonwebtoken');

function finish_test (done) {
  return function (err) {
    if (err) {
      done.fail(err)
    } else {
      done()
    }
  }
}

describe('Composer Test - ', function(){
  it('Composer Module', function(done) {
    Goblin('Composer', function(G) {
      expect(G.User).toBeDefined();
      expect(G.Post).toBeDefined();
      expect(G.Club).toBeDefined();
      done();
    });
  });

  describe('User - ', function() {
    beforeAll(function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.com',
          nick: 'test1',
          password: 'test1234'
        };

        G.User
          .findOne(user)
          .then(function (user) {
            if(user) {
              return G.User.remove(user)
            } else {
              return true
            }
          })
          .then(function() {
            done();
          })
      });
    });

    it('public method', function(done) {
      Goblin('Composer', function(G) {
        expect(G.User.signin).toBeDefined();
        expect(G.User.setToken).toBeDefined();
        expect(G.User.isLogin).toBeDefined();
        expect(G.User.login).toBeDefined();
        expect(G.User.remove).toBeDefined();
        done();
      });
    });

    it('private method', function(done) {
      Goblin('Composer', function(G) {
        expect(G.User._privateMethod).not.toBeDefined();
        done();
      });
    });

    it('signin', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.com',
          nick: 'test1',
          password: 'test1234'
        };

        G.User
          .signin(user)
          .then(function (newUser) {
            var userJS = newUser.get({plain: true});
            expect(userJS.email).toEqual(user.email);
            expect(userJS.nick).toEqual(user.nick);
            expect(userJS.password).toEqual(user.password);
            done();
          });
      });
    });

    it('signin : already signin (email)', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.com',
          nick: 'test12',
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

    it('signin : already signin (nick)', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test1@test.com',
          nick: 'test1',
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

    it('signin : already signin (email, nick)', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.com',
          nick: 'test1',
          password: 'test1234'
        };

        G.User
          .signin(user)
          .catch(function (error) {
            expect(error.name).toEqual('Error');
            done();
          });
      });
    });

    it('signin : already signin (email, nick, password)', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.com',
          nick: 'test1',
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

    it('setToken', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.com',
          nick: 'test1',
          password: 'test1234'
        };

        G.User
          .setToken(user)
          .then(function(token) {
            var decoded = jsonwebtoken.verify(token, 'secret');
            expect(decoded.email).toEqual(user.email);
            expect(decoded.nick).toEqual(user.nick);
            done();
          })
      })
    });

    it('setToken : undefined email', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          nick: 'test1',
          password: 'test1234'
        };

        G.User
          .setToken(user)
          .catch(function(error) {
            expect(error.name).toEqual('Error');
            done();
          })
      })
    });

    it('setToken : undefined nick', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.co.kr',
          password: 'test1234'
        };

        G.User
          .setToken(user)
          .catch(function(error) {
            expect(error.name).toEqual('Error');
            done();
          })
      })
    });

    it('setToken : undefined password', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.co.kr',
          nick: 'test1'
        };

        G.User
          .setToken(user)
          .catch(function(error) {
            expect(error.name).toEqual('Error');
            done();
          })
      })
    });

    it('isLogin', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.com',
          nick: 'test1',
          password: 'test1234'
        };
        G.User
          .setToken(user)
          .then(function(token) {
            return G.User.isLogin(token)
          })
          .then(function (isLogin) {
            var loginUser = isLogin.get({plain:true});
            expect(loginUser.email).toEqual(user.email);
            expect(loginUser.nick).toEqual(user.nick);
            expect(loginUser.password).toEqual(user.password);
            done();
          })
      })
    });

    it('isLogin : invalidate token', function(done) {
      Goblin('Composer', function(G) {
        var token = 'Invalidate token';
        G.User.isLogin(token)
          .catch(function (error) {
            expect(error.name).toEqual('JsonWebTokenError');
            done();
          })
      })
    });

    it('isLogin : invalidate token', function(done) {
      Goblin('Composer', function(G) {
        var token = 'Invalidate token';
        G.User.isLogin(token)
          .catch(function (error) {
            expect(error.name).toEqual('JsonWebTokenError');
            done();
          })
      })
    });

    it('login', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.com',
          password: 'test1234'
        };
        G.User
          .login(user)
          .then(function (loginUser) {
            var userJS = loginUser.get({plain:true});
            expect(userJS.email).toEqual(user.email);
            done();
          })
      })
    });

    it('remove', function(done) {
      Goblin('Composer', function(G) {
        var user = {
          email: 'test@test.com',
          nick: 'test1',
          password: 'test1234'
        };
        G.User
          .remove(user)
          .then(function (removed) {
            expect(removed).toEqual(1);
            done();
          });
      });
    });
  })
});