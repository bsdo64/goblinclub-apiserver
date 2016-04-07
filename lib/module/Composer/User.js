/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var jsonwebtoken = require('jsonwebtoken');
var jwtConf = require('../../config/jsonwebtoken');
var Promise = require('bluebird');
var nodemailer = require('nodemailer');
var redisClient = require('../../redisClient');

var bcrypt = require('bcrypt');

var Model = require('../../../db/models/index');

function ComposerError() {
}

ComposerError.prototype = {
  ComposeUserError: function ComposeUserError() {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'ComposeUserError';
    this.message = temp.message;

    Object.create(Error.prototype, {
      constructor: {
        value: ComposeUserError,
        writable: true,
        configurable: true
      }
    });
  }
};

var ComposeUserError = new ComposerError().ComposeUserError;

module.exports = (function () {
  var setTokenWithRedisSession = function (user, sessionId) {
    var token = jsonwebtoken.sign(user, jwtConf.secret, jwtConf.option);

    return redisClient.get('sess:' + sessionId)
      .then(function (result) {
        var resultJS = JSON.parse(result);
        resultJS.token = token;
        return JSON.stringify(resultJS);
      })
      .then(function (result) {
        return redisClient.set('sess:' + sessionId, result);
      })
      .then(function (result) {
        return token;
      });
  };

  var findOneByUser = function (user) {
    return Model
      .User
      .findOne({where: user})
      .then(function (findUser) {
        if (!findUser) {
          throw new ComposeUserError('No User');
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

  var requestEmailVerifyCode = function (emailObj, sessionId) {
    var code = Math.floor(Math.random() * 900000) + 100000;
    return redisClient.get('sess:' + sessionId)
      .then(function (result) {
        var resultJS = JSON.parse(result);
        resultJS.verifyCode = code;
        return JSON.stringify(resultJS);
      })
      .then(function (result) {
        return redisClient.set('sess:' + sessionId, result);
      })
      .then(function () {
        var transporter = nodemailer.createTransport('smtps://bsdo64%40gmail.com:dkbs13579@smtp.gmail.com');

        var mailOptions = {
          from: '"고블린클럽" <bsdo64@gmail.com>', // sender address
          to: emailObj.email, // list of receivers
          subject: '안녕하세요! 고블린 클럽입니다. 이메일 코드를 확인해주세요', // Subject line
          html: '<b>' + code + '</b>' // html body
        };

        return new Promise(function (resolve, reject) {
          transporter.sendMail(mailOptions, function (error, info) {
            console.log(error, info);
            if (error) {
              return reject(error);
            }

            return resolve({
              result: 'ok',
              message: info.response
            });
          });
        });
      });
  };
  
  var checkVerifyCode = function (codeObj, sessionId) {
    return redisClient.get('sess:' + sessionId)
      .then(function (result) {
        var resultJS = JSON.parse(result);
        if (parseInt(resultJS.verifyCode, 10) !== parseInt(codeObj.verifyCode, 10)) {
          throw new ComposeUserError('인증코드가 일치하지 않습니다');
        }
        
        return { result: 'ok' };
      });
  };

  var signin = function (user, sessionId) {
    var userObj = {
      email: user.email,
      nick: user.nick,
      password: user.password,
      sex: user.sex,
      birth: user.birth
    };

    // password encrypt
    var passwordHash = bcrypt.hashSync(userObj.password, 10);

    var uCreate = {
      email: userObj.email,
      nick: userObj.nick,
      password: passwordHash
    };
    return Model
      .User
      .findOrCreate({where: uCreate})
      .spread(function (newUser, created) {
        if (!created) {
          throw ComposeUserError('이미 존재하는 회원 입니다');
        }

        var userId = newUser.get('id');
        var uProfile = {
          birth: userObj.birth,
          sex: userObj.sex,
          description: null,
          joined_at: new Date(),
          user_id: userId
        };
        
        return Model
          .UserProfile
          .create(uProfile)
          .then(function () {
            return Model
              .UserActivity
              .create({user_id: userId});
          })
          .then(function () {
            return Model
              .UserMembership
              .create({membership_id: 1, user_id: userId});
          })
          .then(function () {
            return Model
              .UserGrade
              .create({grade_id: 1, user_id: userId});
          })
          .then(function () {
            return Model
              .UserPoint
              .create({user_id: userId});
          })
          .then(function () {
            return Model
              .UserReputation
              .create({user_id: userId});
          })
          .then(function () {
            return setTokenWithRedisSession({nick: uCreate.nick, id: userId}, sessionId);
          })
          .then(function (token) {
            return { token: token };
          });
      });
  };

  var login = function (user) {
    return findOneByUser(user)
      .then(function (findUser) {
        var checkPassword = bcrypt.compareSync(user.password, findUser.get('password')); // true
        var u = findUser.get({plain: true});
        return {
          token: jsonwebtoken.sign(u, jwtConf.secret, jwtConf.option),
          user: u
        };
      });
  };

  var isLogin = function (token) {
    return new Promise(function (resolve, reject) {
      if (!token) {
        return resolve(false);
      }

      return jsonwebtoken.verify(token, jwtConf.secret, function (err, decoded) {
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
        throw new ComposeUserError('Not Login');
      }

      return jsonwebtoken.verify(token, jwtConf.secret, function (err, decoded) {
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
  
  var getStatus = function getStatus() {
    
  }
  return {
    // findOneByUser: findOneByUser,
    // setToken: setToken,
    // isLogin: isLogin,
    // needLogin: needLogin,
    // login: login,
    // removeOneByUser: removeOneByUser,
    checkPermissions: checkPermissions,
    getStatus: getStatus,

    checkEmail: checkEmail,
    checkNick: checkNick,
    requestEmailVerifyCode: requestEmailVerifyCode,
    checkVerifyCode: checkVerifyCode,
    signin: signin,
  };
})();
