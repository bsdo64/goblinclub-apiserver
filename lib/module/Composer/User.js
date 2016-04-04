/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var jsonwebtoken = require('jsonwebtoken');
var Promise = require('bluebird');
var nodemailer = require('nodemailer');

var Model = require('../../../db/models/index');
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
    return Model
      .User
      .findOne({where: user})
      .then(function (findUser) {
        if (!findUser) {
          throw new ComposerError('No User');
        }
        return findUser;
      });
  };

  var checkEmail = function (emailObj) {
    return Model
      .User
      .findOne({where: emailObj})
      .then(function (findUser) {
        return findUser;
      });
  };

  var checkNick = function (nickObj) {
    return Model
      .User
      .findOne({where: nickObj})
      .then(function (findUser) {
        return findUser;
      });
  };

  var verifyEmail = function (verifyObj) {
    var transporter = nodemailer.createTransport('smtps://bsdo64%40gmail.com:dkbs13579@smtp.gmail.com');

    var mailOptions = {
      from: '"고블린클럽" <bsdo64@gmail.com>', // sender address
      to: verifyObj.signinEmail, // list of receivers
      subject: '안녕하세요! 고블린 클럽입니다. 이메일 코드를 확인해주세요', // Subject line
      html: '<b>' + verifyObj.verifyCode + '</b>' // html body
    };

// send mail with defined transport object

    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions, function (error, info) {
        console.log(error, info);
        if (error) {
          return reject(error);
        }

        return resolve({
          result: 'ok',
          verifyCode: verifyObj.verifyCode,
          message: info.response
        });
      });
    });
  };

  var signin = function (user) {
    var userObj = {
      email: user.email,
      nick: user.nick,
      password: user.password,
      sex: user.sex,
      birth: user.birth
    };

    return Model
      .User
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

            return Model.Auth.create({userId: newUser.get('id')})
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
        var u = findUser.get({plain: true});
        return {
          token: jsonwebtoken.sign(u, 'secret', {expiresIn: '7d'}),
          user: u
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
        return Model
          .User
          .destroy({where: findUser});
      });
  };

  var checkPermissions = function (token) {
    return new Promise(function (resolve, reject) {
      var result = {};
      
      if (!token) {
        return resolve(null);
      }

      return Model
        .User
        .findOne({
          where: {id: 2},
          include: [
            { model: Model.UserMembership, include: [ Model.Membership ] },
            { model: Model.UserGrade, include: [ Model.Grade ] },
            { model: Model.UserProfile },
          ]
        })
        .then(function (user) {
          result.UserMembership = user.get('UserMembership');
          result.UserGrade = user.get('UserGrade');
          result.UserProfile = user.get('UserProfile');
          return resolve(result);
        });
    })
  };
  return {
    // findOneByUser: findOneByUser,
    // signin: signin,
    // checkEmail: checkEmail,
    // checkNick: checkNick,
    // verifyEmail: verifyEmail,
    // setToken: setToken,
    // isLogin: isLogin,
    // needLogin: needLogin,
    // login: login,
    // removeOneByUser: removeOneByUser,
    checkPermissions: checkPermissions
  };
})();
