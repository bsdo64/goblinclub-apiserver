/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var _ = require('lodash');
var moment = require('moment');

var Model = require('../../../db/models/index');
var Point = Model.point;
var PointLog = Model.point_log;

var ComposeUser = require('./User');

// Error Module
function ComposerError(message) {
  this.name = 'ComposerError';
  this.message = message || '서버 에러';
}
ComposerError.prototype = new Error();
ComposerError.prototype.constructor = ComposerError;

module.exports = (function () {
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

  var _point = function (user, point) {
    return ComposeUser
      .findOneByUser(user)
      .then(function (findUser) {
        point.userId = findUser.get('id');

        return Point.findOne({where: {userId: point.userId}});
      })
      .then(function (p) {
        if (!p) {
          return Point.create(point);
        }

        if (p && (point.point > 0)) {
          return p.increment('point', {by: point.point});
        } else if (p && (point.point <= 0)) {
          return p.decrement('point', {by: -point.point});
        }
      })
      .then(function (p) {
        var pLog = {
          type: point.point > 0,
          value: Math.abs(point.point),
          userId: point.userId,
          pointId: p.get('id')
        };
        return PointLog.create(pLog)
          .then(function (L) {
            return L.setPoint(p);
          })
          .then(function (log) {
            return Point.findOne({where: {userId: point.userId}});
          });
      })
      .then(function (p) {
        return p.getPointLog();
      })
      .then(function (logs) {
        return logs;
      })
      .catch(function (err) {
        return err;
      });
  };

  // public
  var createPost = function (user) {
    var point = {
      point: 100
    };
    return _point(user, point);
  };

  var createComment = function (user) {
    var point = {
      point: 200
    };
    return _point(user, point);
  };

  var removePost = function (user) {
    var point = {
      point: -100
    };
    return _point(user, point);
  };

  var removeComment = function (user) {
    var point = {
      point: -200
    };
    return _point(user, point);
  };

  return {
    createPost: createPost,
    createComment: createComment,
    removePost: removePost,
    removeComment: removeComment
  };
})();
