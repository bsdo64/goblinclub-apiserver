var jsonwebtoken = require('jsonwebtoken');
var jwtConf = require('../lib/config/jsonwebtoken');
var model = require('../db/models/index');
var CheckUserAuthError = require('../ApiServerError').CheckUserAuthError;
var redisClient = require('../lib/redisClient/index');
var cookieParser = require('cookie-parser');
var assign = require('deep-assign');

function tokenVerify(token, redisToken) {
  return token === redisToken;
}

module.exports = function checkUserAuth(req, res, next) {
  // ServerSide Request
  var sessionId;
  var token;

  // ClientSide Ajax Call
  if (req.cookies.sessionId) {
    sessionId = cookieParser.signedCookie(req.cookies.sessionId, '1234567890QWERTY');
    token = req.cookies.token;
  } else {
    sessionId = req.header('sessionId');
    token = req.header('token');
  }

  // 잘못된 접근 without session
  if (!sessionId) {
    return next(new CheckUserAuthError('Not defined sessionId'));
  } else {
    redisClient.get('sess:' + sessionId, function (err, result) {
      var resultJS = JSON.parse(result);

      if (err) {
        next(err);
      }
      if (!resultJS) {
        next(new CheckUserAuthError('Malformed sessionId'));
      }
      
      if (resultJS.token && !token) {
        next(new CheckUserAuthError('Client dont has Token but redis has'));
      }

      if (resultJS.token && token) {
        var verifyToken = tokenVerify(token, resultJS.token);
        if (!verifyToken) {
          next(new CheckUserAuthError('Malformed token'));
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
