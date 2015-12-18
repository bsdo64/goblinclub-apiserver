/**
 * Created by dobyeongsu on 2015. 12. 11..
 */
var _ = require('lodash');
var moment = require('moment');

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
      var _privateMethod = function () {
        // private
      };

      var Hello = function (query) {
        // public
      };

      var World = function () {
        // public

      };

      return {
        Hello: Hello,
        World: World
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
