var jsonwebtoken = require('jsonwebtoken');
var jwtConf = require('../lib/config/jsonwebtoken');
var model = require('../db/models/index');
var CheckUserAuthError = require('../ApiServerError').CheckUserAuthError;
var Redis = require('ioredis');
var redis = new Redis({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
  db: 0
});
var assign = require('deep-assign');

function tokenVerify(token, redisToken) {
  return token === redisToken;
}

module.exports = function checkUserAuth(req, res, next) {
  var sessionId = req.header('sessionId');
  var token = req.header('token');

  // 잘못된 접근 without session
  if (!sessionId) {
    return next(new CheckUserAuthError('Not defined sessionId'));
  } else {
    redis.get('sess:' + sessionId, function (err, result) {
      if (err) {
        return next(err);
      }
      if (!result) {
        return next(new CheckUserAuthError('Malformed sessionId'));
      }
      
      if (result.token && !token) {
        return next(new CheckUserAuthError('Token not same with redis'));
      }

      if (result.token && token) {
        var verifyToken = tokenVerify(token, result.token);
        if (!verifyToken) {
          return next(new CheckUserAuthError('Malformed token'));
        }

        jsonwebtoken.verify(token, jwtConf.secret, function (jwtErr, decoded) {
          // err
          if (jwtErr || !decoded) {
            return next(jwtErr);
          }

          var userObj = {
            id: decoded.id,
            nick: decoded.nick
          };
          // decoded undefined
          model
            .User
            .findOne({where: userObj})
            .then(function (user) {
              if (!user) {
                return next(new CheckUserAuthError('Malformed jwt payload'));
              }

              assign(res, { UserStore: { user: user.get({plain: true}), login: true} });
              next(); // User Login!!
            });
        });
      } else {
        assign(res, { UserStore: { user: null, login: false} });
        next(); // User Not Login!!
      }
    });
  }
};
