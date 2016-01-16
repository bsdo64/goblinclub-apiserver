/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var _ = require('lodash');
var moment = require('moment');

var Model = require('../../../db/index');
var User = Model.user;
var Post = Model.post;
var Club = Model.club;
var Vote = Model.vote;

var ClubComposer = require('./Club');

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
  var findBest = function () {
    return Post
      .findAll({
        where: {
          createdAt: {
            $lt: new Date(),
            $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
          }
        },
        order: [
          ['voteCount', 'DESC'],
          ['createdAt', 'DESC']
        ],
        limit: 11,
        include: [
          {model: User, required: true, attributes: ['nick', 'id']},
          {model: Club, required: true, as: 'belongingClubs'}
        ]
      })
      .then(function (posts) {
        _timeSet(posts);

        return posts;
      });
  };

  var findOne = function (uid) {
    return Post
      .findOne({
        where: {uid: uid}
      })
      .then(function (post) {
        if (!post) {
          throw new ComposerError('No Post');
        }
        return post;
      });
  };

  var findOneByClub = function (clubName, postId) {
    return ClubComposer.findOneByUrl(clubName)
      .then(function (club) {
        return club.getClubHas({
          where: {uid: postId},
          limit: 1,
          include: [
            {model: User, required: true, attributes: ['nick', 'id']},
            {model: Club, required: true, as: 'belongingClubs'}
          ]
        });
      })
      .then(function (post) {
        var postOne = post[0];
        if (!postOne) {
          throw new ComposerError('No Post');
        }
        _timeSet(postOne);
        return postOne;
      });
  };

  var findPostByClub = function (clubName) {
    return ClubComposer.findOneByUrl(clubName)
      .then(function (findClub) {
        return findClub.getClubHas({
          limit: 15,
          order: [['createdAt', 'DESC']],
          include: [
            {model: User, required: true, attributes: ['nick', 'id']},
            {model: Club, required: true, as: 'belongingClubs'}
          ]
        });
      })
      .then(function (posts) {
        if (!posts) {
          throw new ComposerError('No Post');
        }

        _timeSet(posts);
        return posts;
      });
  };

  var findPostUserCreated = function (user) {
    return User
      .findOne(user)
      .then(function (findUser) {
        return findUser.getPosts({
          order: [
            ['createdAt', 'DESC']
          ],
          include: [
            {model: User, required: true, attributes: ['nick', 'id']},
            {model: Club, required: true, as: 'belongingClubs'}
          ]
        });
      })
      .then(function (posts) {
        _timeSet(posts);

        return posts;
      });
  };

  var like = function (uid, user) {
    var post;
    return Post
      .findOne({where: uid})
      .then(function (findPost) {
        if (!findPost) {
          return new ComposerError('No Post');
        }
        post = findPost;
        return User.findOne({where: user});
      })
      .then(function (findUser) {
        return Vote.upsert({
          liker: findUser.get('id'),
          votable: 'post',
          votableId: post.get('uid'),
          kind: 1
        });
      })
      .then(function () {
        return post.increment({voteCount: 1, likeCount: 1});
      })
      .then(function () {
        return Post.findOne({where: uid});
      })
      .catch(function (e) {
        return e;
      });
  };

  var unlike = function (uid, user) {
    var post;
    return Post
      .findOne({where: uid})
      .then(function (findPost) {
        if (!findPost) {
          return new ComposerError('No Post');
        }
        post = findPost;
        return User.findOne({where: user});
      })
      .then(function (findUser) {
        if (!findUser) {
          return new ComposerError('No User');
        }

        return Vote.destroy({
          where: {
            liker: findUser.get('id'),
            votable: 'post',
            votableId: post.get('uid'),
            kind: 1
          }
        });
      })
      .then(function () {
        return post.decrement({voteCount: 1, likeCount: 1});
      })
      .then(function () {
        return Post.findOne({where: post.get('uid')});
      })
      .catch(function (e) {
        return e;
      });
  };

  var dislike = function (uid, user) {
    var post, findUser;
    return Post
      .findOne({where: uid})
      .then(function (findPost) {
        if (!findPost) {
          return Error('No Post');
        }
        post = findPost;
        return User.findOne({where: user});
      })
      .then(function (user) {
        findUser = user;
        return Vote.upsert({
          liker: findUser.get('id'),
          votable: 'post',
          votableId: post.get('uid'),
          kind: 0
        });
      })
      .then(function () {
        return post.decrement({voteCount: 1, likeCount: 1});
      })
      .then(function () {
        return Post.findOne({where: uid});
      })
      .catch(function (e) {
        return e;
      });
  };

  var undislike = function (uid, user) {
    var post, findUser;
    return Post
      .findOne({where: uid})
      .then(function (findPost) {
        if (!findPost) {
          return Error('No Post');
        }
        post = findPost;
        return User.findOne({where: user});
      })
      .then(function () {
        findUser = user;
        return Vote.destroy({
          where: {
            liker: findUser.get('id'),
            votable: 'post',
            votableId: post.get('uid'),
            kind: 0
          }
        });
      })
      .then(function () {
        return post.increment({voteCount: 1, likeCount: 1});
      })
      .then(function () {
        return Post.findOne({where: uid});
      })
      .catch(function (e) {
        return e;
      });
  };

  return {
    findBest: findBest,
    findPostByClub: findPostByClub,
    findOneByClub: findOneByClub,
    findPostUserCreated: findPostUserCreated,
    like: like,
    dislike: dislike,
    unlike: unlike,
    undislike: undislike
  };
})();
