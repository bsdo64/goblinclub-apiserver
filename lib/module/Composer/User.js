/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var jsonwebtoken = require('jsonwebtoken');
var Promise = require('bluebird');

var Model = require('../../../db/models/index');
var User = Model.user;
var Auth = Model.auth;
var Point = Model.point;

// Error Module
function ComposerError(message) {
  this.name = 'ComposerError';
  this.message = message || '서버 에러';
}
ComposerError.prototype = new Error();
ComposerError.prototype.constructor = ComposerError;

module.exports = (function () {
  var _verityUser = function (user) {
    // private
    if (!user.email) {
      throw new ComposerError('undefined email');
    }
    if (!user.nick) {
      throw new ComposerError('undefined nick');
    }
    if (!user.password) {
      throw new ComposerError('undefined password');
    }
    return true;
  };

  var findOneByUser = function (user) {
    return User
      .findOne({where: user})
      .then(function (findUser) {
        if (!findUser) {
          throw new ComposerError('No User');
        }
        return findUser;
      });
  };

  var signin = function (user) {
    var userObj = {
      email: user.email,
      nick: user.nick,
      password: user.password
    };

    return User
      .findOrCreate({where: userObj})
      .spread(function (newUser, created) {
        return new Promise(function (resolve, reject) {
          if (!created) {
            return reject(new ComposerError('Already signin User'));
          }

          jsonwebtoken.sign(user, 'secret', {expiresIn: '7d'}, function (token) {
            var result = {
              token: token,
              user: newUser
            };

            return Auth.create({userId: newUser.get('id')})
              .then(function (auth) {
                return auth.setUser(newUser);
              })
              .then(function () {
                return Point.create({userId: newUser.get('id')});
              })
              .then(function (point) {
                return point.setUser(newUser);
              })
              .then(function () {
                resolve(result);
              })
              .catch(function (err) {
                reject(err);
              });
          });
        });
      });
  };

  var setToken = function (user) {
    var verify = _verityUser(user);
    return new Promise(function (resolve, reject) {
      if (verify === true) {
        var token = jsonwebtoken.sign(user, 'secret');
        resolve(token);
      } else {
        reject(verify);
      }
    });
  };

  var login = function (user) {
    return findOneByUser(user)
      .then(function (findUser) {
        return {
          token: jsonwebtoken.sign(findUser, 'secret', {expiresIn: '7d'}),
          user: findUser
        };
      });
  };

  var isLogin = function (token) {
    return new Promise(function (resolve, reject) {
      if (!token) {
        return resolve(false);
      }

      return jsonwebtoken.verify(token, 'secret', function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return reject(err);
          }
          if (err.name === 'TokenExpiredError') {
            return reject(err);
          }
        }

        return findOneByUser({nick: decoded.nick})
          .then(function (user) {
            return resolve(user);
          })
          .catch(function (error) {
            return reject(error);
          });
      });
    });
  };

  var needLogin = function (token) {
    return new Promise(function (resolve, reject) {
      if (!token) {
        throw new ComposerError('Not Login');
      }

      return jsonwebtoken.verify(token, 'secret', function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return reject(err);
          }
          if (err.name === 'TokenExpiredError') {
            return reject(err);
          }
        }

        return findOneByUser({nick: decoded.nick})
          .then(function (user) {
            return resolve(user);
          });
      });
    });
  };

  var removeOneByUser = function (user) {
    return findOneByUser(user)
      .then(function (findUser) {
        return User.destroy({where: findUser});
      });
  };

  return {
    findOneByUser: findOneByUser,
    signin: signin,
    setToken: setToken,
    isLogin: isLogin,
    needLogin: needLogin,
    login: login,
    removeOneByUser: removeOneByUser
  };
})();
