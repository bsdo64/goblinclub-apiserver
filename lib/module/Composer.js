/**
 * Created by dobyeongsu on 2015. 12. 11..
 */
var _ = require('lodash');
var moment = require('moment');
var jsonwebtoken = require('jsonwebtoken');
var Promise = require('bluebird');

var Model = require('../../db');
var User = Model.user;
var Post = Model.post;
var Club = Model.club;
var Comment = Model.comment;

module.exports = function () {
  return function (G) {
    // Property

    // Private
    var _timeSet = function (datas) {
      function timeSetRow(row) {
        row.setDataValue('createdAt', moment(row.createdAt).fromNow());
        row.setDataValue('updatedAt', moment(row.updatedAt).fromNow());
      }

      if (datas instanceof Array) {
        _.map(datas, function (data) {
          timeSetRow(data);
          return data;
        });
      } else if (typeof datas === 'object') {
        timeSetRow(datas);
      }
    };

    // Public
    G.User = (function () {
      var _verityUser = function (user) {
        // private
        if (!user.email) {
          return Error('undefined email');
        }
        if (!user.nick) {
          return Error('undefined nick');
        }
        if (!user.password) {
          return Error('undefined password');
        }
        return true;
      };

      var findOne = function (user) {
        return User
          .findOne({where: user})
          .then(function (newUser) {
            return newUser;
          });
      };

      var signin = function (user) {
        return User
          .findOrCreate({where: user})
          .spread(function (newUser, created) {
            if (!created) {
              throw Error('Already signin User');
            }
            return newUser;
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
            return User
              .findOne({where: decoded})
              .then(function (user) {
                if (!user) {
                  reject(false);
                }
                resolve(user);
              });
          });
        });
      };

      var login = function (user) {
        return User
          .findOne({where: user})
          .then(function (findUser) {
            if (!findUser) {
              throw user;
            }

            return findUser;
          })
          .catch(function (err) {
            return err;
          });
      };

      var remove = function (user) {
        return User
          .findOne({where: user})
          .then(function (findUser) {
            if (!findUser) {
              throw user;
            }

            return User.destroy({where: user});
          });
      };

      return {
        findOne: findOne,
        signin: signin,
        setToken: setToken,
        isLogin: isLogin,
        remove: remove,
        login: login
      };
    })();

    G.Post = (function () {
      // public
      var findAll = function (queryOptions) {
        return Post
          .findAll(queryOptions)
          .then(function (posts) {
            _timeSet(posts);

            return posts;
          });
      };

      return {
        findAll: findAll
      };
    })();

    G.Club = (function () {
      // public
      var findAll = function (queryOptions) {
        return Club
          .findAll(queryOptions)
          .then(function (clubs) {
            _timeSet(clubs);

            return clubs;
          });
      };

      var findOne = function (queryOptions) {
        return Club
          .findOne(queryOptions)
          .then(function (club) {
            _timeSet(club);
            return club;
          });
      };

      return {
        findAll: findAll,
        findOne: findOne
      };
    })();
  };
};
