/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var jsonwebtoken = require('jsonwebtoken');
var Promise = require('bluebird');

var Model = require('../../../db/index');
var User = Model.user;

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
    return User
      .findOrCreate({where: user})
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
            return resolve(result);
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

  var isLogin = function (token) {
    return new Promise(function (resolve, reject) {
      if (!token) {
        return resolve(false);
      }

      jsonwebtoken.verify(token, 'secret', function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return reject(err);
          }
          if (err.name === 'TokenExpiredError') {
            return reject(err);
          }
        }
        var u = {
          id: decoded.id,
          email: decoded.email
        };

        return findOneByUser(u)
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

      jsonwebtoken.verify(token, 'secret', function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return reject(err);
          }
          if (err.name === 'TokenExpiredError') {
            return reject(err);
          }
        }

        delete decoded.iat;
        delete decoded.exp;
        return findOneByUser({id: decoded.id})
          .then(function (user) {
            return resolve(user);
          });
      });
    });
  };

  var login = function (user) {
    return findOneByUser(user)
      .then(function (findUser) {
        return jsonwebtoken.sign(findUser, 'secret', {expiresIn: '7d'});
      });
  };

  var remove = function (user) {
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
    remove: remove
  };
})();