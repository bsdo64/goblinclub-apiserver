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

  var createComment = function (content, postId, user, commentId) {
    var comment;
    content = content.replace(new RegExp('\r?\n','g'), '<br />');
    var sanitizedContent = DOMPurify.sanitize(content, {ADD_TAGS: ['br']});

    return Comment.create({
      commentId: shortId.generate(),
      postId: postId,
      content: sanitizedContent,
      author: user.id,
      parentCommentId: commentId ? commentId : null
    }).then(function (newComment) {
      comment = newComment;
      return PostComposer.findOneByUid(postId);
    }).then(function (findPost) {
      return findPost.increment({commentCount: 1});
    }).then(function () {
      return findByPostId(postId);
    }).then(function (comments) {
      return comments;
    });
  };

  return {
    findByPostId: findByPostId,
    createComment: createComment
  };
})();
