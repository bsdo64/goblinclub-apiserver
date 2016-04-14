/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var _ = require('lodash');
var moment = require('moment');
var shortId = require('shortid');
var document = require('jsdom').jsdom();
var DOMPurify = require('dompurify')(document.defaultView);

var Model = require('../../../db/models/index');
var Comment = Model.comment;
var User = Model.user;

var PostComposer = require('./Post');

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

  var _carrigeToBr = function (datas) {
    function setRow(row) {
      row.setDataValue('content', row.content.replace(new RegExp('\r?\n','g'), '<br />'));
    }

    if (datas instanceof Array) {
      _.map(datas, function (data) {
        setRow(data);
        return data;
      });
    } else if (typeof datas === 'object') {
      setRow(datas);
    }
  };

  // public
  var findByPostId = function (postId) {
    return Comment.findAll({
      limit: 5,
      include: [{
        model: Comment,
        include: [{model: User}],
        as: 'descendents',
        hierarchy: true
      }, {
        model: User
      }],
      where: {hierarchyLevel: 1, postId: postId},
      order: [
        ['createdAt', 'DESC']
      ]
    })
    .then(function (comments) {
      _timeSet(comments);

      return comments;
    });
  };

  var createComment = function (options) {
    var prop = {
      post_id: options.post_id,
      content: options.content
    };
    var comment;

    return Model
      .Comment
      .create({
        post_id: prop.post_id,
        content: prop.content,
        user_id: 1
      })
      .then(function (newComment) {
        comment = newComment;
        return Model
          .Post
          .findOne({where: { id: prop.post_id}});
      })
      .then(function (post) {
        return post.increment('comment_count', {by: 1});
      })
      .then(function () {
        return Model
          .UserActivity
          .findOne({where: {user_id : 1}});
      })
      .then(function (userActivity) {
        return userActivity.increment('comment_counts', {by: 1});
      })
      .then(function () {
        return comment;
      });
  };

  return {
    findByPostId: findByPostId,
    createComment: createComment
  };
})();
