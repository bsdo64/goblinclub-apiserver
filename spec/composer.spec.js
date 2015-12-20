/**
 * Created by dobyeongsu on 2015. 12. 19..
 */

describe('Composer Test - ', function () {
  var Goblin = require('../lib/index');
  var jsonwebtoken = require('jsonwebtoken');
  var model = require('../db');

  beforeAll(function (done) {
    var tUser, tClub1, tClub2;
    (function loop(value) {
      if (value !== 10) {
        model
          .user
          .create({
            email: 'tests' + value + '@test.com',
            nick: 'tests' + value,
            password: 'teset1234'
          })
          .then(function (user) {
            tUser = user;

            return model
              .club
              .create({
                name: '테스트' + value,
                url: 'test' + value,
                description: '테스트입니다',
                type: 'default',
                creator: tUser.get({plain: true}).id
              });
          })
          .then(function (club) {
            tClub1 = club;

            return model
              .club
              .create({
                name: '게임' + value,
                url: 'game' + value,
                description: '게임입니다',
                type: 'create',
                creator: tUser.get({plain: true}).id
              });
          })
          .then(function (club) {
            tClub2 = club;

            return tClub2.setUsers(tUser);
          })
          .then(function () {
            return model
              .post
              .create({
                uid: '1q' + value,
                title: 'Hello world',
                content: '<p class=""><br></p><p class="">내용</p><div class="medium-insert-embeds"> <figure> <div class="medium-insert-embed"> <div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;"><iframe src="https://www.youtube.com/embed/ycSOnGzbNO4?wmode=transparent&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;enablejsapi=1" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;"></iframe></div> </div> </figure> </div><p><br></p>',
                author: tUser.get({plain: true}).id
              });
          })
          .then(function (post) {
            return post.setClubs(tClub1);
          })
          .then(function () {
            return model
              .post
              .create({
                uid: '1q2w' + value,
                title: 'Hello world',
                content: '<p class=""><br></p><p class="">내용</p><div class="medium-insert-embeds"> <figure> <div class="medium-insert-embed"> <div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;"><iframe src="https://www.youtube.com/embed/ycSOnGzbNO4?wmode=transparent&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;enablejsapi=1" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;"></iframe></div> </div> </figure> </div><p><br></p>',
                author: tUser.get({plain: true}).id
              });
          })
          .then(function (post) {
            return post.setClubs(tClub2);
          })
          .then(function () {
            return value + 1;
          })
          .then(loop);
      } else if (value === 10) {
        console.log('DB init - test case : ', value);
        done();
      }
      return Promise.resolve(value);
    })(0);
  });

  afterAll(function (done) {
    model.sequelize.sync({force: true})
      .then(function () {
        console.log('DB reset');
        done();
      });
  });

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
      Goblin('Composer', function (G) {
        var user = {
          email: 'tests@test.com',
          nick: 'test',
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
            expect(error.name).toEqual('Error');
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
            expect(error.name).toEqual('Error');
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
            expect(error.name).toEqual('Error');
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
          .then(function (loginUser) {
            var userJS = loginUser.get({plain: true});
            expect(userJS.email).toEqual(user.email);
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
    it('create default club', function (done) {
      Goblin('Composer', function (G) {
        done();
      });
    });
  });

  describe('Post - ', function () {

    it('find one post', function (done) {
      done();
    });
  });
});
