/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var _ = require('lodash');
var moment = require('moment');
var document = require('jsdom').jsdom();
var DOMPurify = require('dompurify')(document.defaultView);

var Model = require('../../../db/models/index');
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
    var sanitizedName = DOMPurify.sanitize(club.name),
        sanitizedUrl = DOMPurify.sanitize(club.url),
        sanitizedDesc = DOMPurify.sanitize(club.description);

    return Club
      .findOrCreate({where: {
        name: sanitizedName,
        url: sanitizedUrl,
        description: sanitizedDesc,
        type: 'create',
        creator: user.id
      }})
      .spread(function (newClub, created) {
        if (!created) {
          throw ComposerError('Already created Club');
        }

        return newClub.setCreator(user)
          .then(function () {
            return newClub;
          });
      });
  };

  var createDefault = function (club, user) {
    var sanitizedName = DOMPurify.sanitize(club.name),
      sanitizedUrl = DOMPurify.sanitize(club.url),
      sanitizedDesc = DOMPurify.sanitize(club.description);

    return Club
      .findOrCreate({where: {
        name: sanitizedName,
        url: sanitizedUrl,
        description: sanitizedDesc,
        type: 'default',
        creator: user.id
      }})
      .spread(function (newClub, created) {
        if (!created) {
          throw ComposerError('Already created Club');
        }
        return newClub.setCreatedBy(user)
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

  var findClubList = function () {
    return Model
      .ClubGroup
      .findAll({
        attributes: ['id', 'title', 'description', 'order', 'using'],
        order: [
          ['order', 'ASC']
        ],
        include: [
          { model: Model.Club,
            order: [ ['order', 'ASC'] ],
            attributes: ['id', 'title', 'description', 'order', 'url'] }
        ]
      });
  };
  var findClubPrefix = function (url) {
    return Model
      .Club
      .findOne({
        where: { url: url },
        include: [ Model.Prefix ]
      });
  };
  var findOneClubByUrl = function (url) {
    return Model
      .Club
      .findOne({
        where: { url: url }
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
    findUserSubs: findUserSubs,

    findClubList: findClubList,
    findClubPrefix: findClubPrefix,
    findOneClubByUrl: findOneClubByUrl,
  };
})();
