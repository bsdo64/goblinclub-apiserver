/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var _ = require('lodash');
var moment = require('moment');
var shortId = require('shortid');

var Model = require('../../../db/models/index');
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
  var createPost = function (post, user) {
    var createdPost, clubList = [];

    return Post.create({
      uid: shortId.generate(),
      title: post.title,
      content: post.content,
      author: user.id
    }).then(function (newPost) {
      createdPost = newPost;
      clubList.push(post.defaultClubList);
      clubList.push(post.subscribeClubList);
      clubList = _.flattenDeep(clubList);

      return Club.findAll({where: {id: {$or: clubList}}});
    }).then(function (clubs) {
      return createdPost.setBelongingClubs(clubs);
    }).then(function (club_post) {
      var postId = club_post[0][0].get()['postId'];
      return Post.find({
        where: {uid: postId},
        include: [
          {model: User, required: true, attributes: ['nick', 'id']},
          {model: Club, required: true, as: 'belongingClubs'}
        ]
      });
    });
  };

  var findBest = function (p) {
    var limit = 10;
    var offset = p ? p * limit : 0;
    return Post
      .findAll({
        where: {
          createdAt: {
            $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
          }
        },
        order: [
          ['voteCount', 'DESC'],
          ['createdAt', 'DESC']
        ],
        limit: limit,
        offset: offset,
        include: [
          {model: User, required: true, attributes: ['nick', 'id']},
          {model: Club, as: 'belongingClubs'}
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
            {model: Club, as: 'belongingClubs'}
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

  var findPostByClub = function (clubUrl, page) {
    var limit = 15;
    var offset = page ? page * limit : 0;
    return ClubComposer.findOneByUrl(clubUrl)
      .then(function (findClub) {
        return findClub.getClubHas({
          limit: limit,
          offset: offset,
          order: [['createdAt', 'DESC']],
          include: [
            {model: User, required: true, attributes: ['nick', 'id']},
            {model: Club, as: 'belongingClubs'},
            {model: Club, as: 'belongingDefaultClub'},
            {model: Club, as: 'belongingSubClubs'}
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
            {model: Club, as: 'belongingClubs', where: {type: 'default'}}
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
        return Post.findOne({where: uid});
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
          return new ComposerError('No Post');
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
          return new ComposerError('No Post');
        }
        post = findPost;
        return User.findOne({where: user});
      })
      .then(function (user) {
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
    createPost: createPost,
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
