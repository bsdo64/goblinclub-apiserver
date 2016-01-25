/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var _ = require('lodash');
var moment = require('moment');

var Model = require('../../../db/index');
var Club = Model.club;

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

  // public
  var createClub = function (club, user) {
    return Club.create({
      name: club.name,
      url: club.url,
      description: club.description,
      type: 'create',
      creator: user.id
    }).then(function (newClub) {
      return newClub.setSubscribedBy(user)
        .then(function () {
          return newClub;
        });
    });
  };

  var findAll = function (queryOptions) {
    return Club
      .findAll(queryOptions)
      .then(function (clubs) {
        _timeSet(clubs);

        return clubs;
      });
  };

  var findOne = function (club) {
    return Club
      .findOne({where: club})
      .then(function (findClub) {
        if (!findClub) {
          throw new ComposerError('No Club');
        }
        return findClub;
      });
  };

  var findOneByUrl = function (url) {
    return Club
      .findOne({where: {url: url}})
      .then(function (findClub) {
        if (!findClub) {
          throw new ComposerError('No Club');
        }
        return findClub;
      });
  };

  var findDefaults = function () {
    return Club
      .findAll({where: {type: 'default'}})
      .then(function (clubs) {
        _timeSet(clubs);

        return clubs;
      });
  };

  var createDefault = function (club) {
    return Club
      .findOrCreate({where: club})
      .spread(function (newClub, created) {
        if (!created) {
          throw Error('Already created Club');
        }
        return newClub;
      });
  };

  var findUserCreated = function (user) {
    return ComposeUser.findOneByUser(user)
      .then(function (findUser) {
        return findUser.getUserCreatedClubs();
      });
  };

  var findUserSubs = function (user) {
    return ComposeUser.findOneByUser(user)
      .then(function (findUser) {
        return findUser.getUserSubscribedClubs();
      });
  };

  return {
    createClub: createClub,
    findAll: findAll,
    findOne: findOne,
    findOneByUrl: findOneByUrl,
    findDefaults: findDefaults,
    createDefault: createDefault,
    findUserCreated: findUserCreated,
    findUserSubs: findUserSubs
  };
})();
