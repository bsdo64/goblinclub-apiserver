/**
 * Created by dobyeongsu on 2016. 1. 15..
 */
var _ = require('lodash');
var moment = require('moment');
var shortId = require('shortid');
var document = require('jsdom').jsdom();
var DOMPurify = require('dompurify')(document.defaultView);

var Model = require('../../../db/models/index');

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
    var createdPost,
        clubList = [],
        sanitizedTitle = DOMPurify.sanitize(post.title),
        sanitizedContent = DOMPurify.sanitize(post.content, {
          ADD_TAGS: ['figure', 'img', 'div', 'iframe'],
          ADD_ATTR: ['frameborder', 'allowfullscreen','webkitallowfullscreen', 'mozallowfullscreen']
        });

    return Model.Post.create({
      uid: shortId.generate(),
      title: sanitizedTitle,
      content: sanitizedContent,
      author: user.id
    }).then(function (newPost) {
      createdPost = newPost;
      clubList.push(post.defaultClubList);
      clubList.push(post.subscribeClubList);
      clubList = _.flattenDeep(clubList);

      return Model.Club.findAll({where: {id: {$or: clubList}}});
    }).then(function (clubs) {
      return createdPost.setBelongingClubs(clubs);
    }).then(function (club_post) {
      var postId = club_post[0][0].get()['postId'];
      return Model.Post.find({
        where: {uid: postId},
        include: [
          {model: Model.User, required: true, attributes: ['nick', 'id']},
          {model: Model.Club, as: 'belongingDefaultClub'},
          {model: Model.Club, as: 'belongingSubClubs'}
        ]
      });
    });
  };

  var findBest = function (p, user) {
    var limit = 10;
    var offset = p ? p * limit : 0;
    var include = [
      {model: Model.User, required: true, attributes: ['nick', 'id']},
      {model: Model.Club, as: 'belongingDefaultClub'},
      {model: Model.Club, as: 'belongingSubClubs'}
    ];
    if (user) {
      include.push({model: Model.Vote, as: 'userVoted', where: {liker: user.get('id')}, required: false});
    }

    return Model.Post
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
        include: include
      })
      .then(function (posts) {
        _timeSet(posts);
        return posts;
      });
  };

  var findOneByUid = function (uid) {
    return Model.Post
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
            {model: Model.User, required: true, attributes: ['nick', 'id']},
            {model: Model.Club, as: 'belongingDefaultClub'},
            {model: Model.Club, as: 'belongingSubClubs'}
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
            {model: Model.User, required: true, attributes: ['nick', 'id']},
            {model: Model.Club, as: 'belongingDefaultClub'},
            {model: Model.Club, as: 'belongingSubClubs'}
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
    return Model.User
      .findOne(user)
      .then(function (findUser) {
        return findUser.getPosts({
          order: [
            ['createdAt', 'DESC']
          ],
          include: [
            {model: Model.User, required: true, attributes: ['nick', 'id']},
            {model: Model.Club, as: 'belongingClubs', where: {type: 'default'}}
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
    return findOneByUid(uid)
      .then(function (findPost) {
        if (!findPost) {
          return new ComposerError('No Post');
        }
        post = findPost;

        return Model.Vote.findOne({
          where: {
            liker: user.get('id'),
            votable: 'post',
            votableId: post.get('uid')
          }
        });
      })
      .then(function (vote) {
        if (!vote) {
          return Model.Vote.create({
              liker: user.get('id'),
              votable: 'post',
              votableId: post.get('uid'),
              kind: 1
          })
                          .then(function (createdVote) {
            if (createdVote) {
              return post.increment({voteCount: 1, likeCount: 1});
            }
            return null;
          });
        }
        return null;
      })
      .then(function () {
        return post;
      })
      .catch(function (e) {
        return e;
      });
  };

  var likeFromDislike = function (uid, user) {
    var post;
    return findOneByUid(uid)
      .then(function (findPost) {
        if (!findPost) {
          return new ComposerError('No Post');
        }
        post = findPost;
        return Model.Vote.update({
          kind: 1
        }, {
          where: {
            liker: user.get('id'),
            votable: 'post',
            votableId: post.get('uid'),
            kind: 0
          }
        });
      })
      .spread(function (vote, created) {
        if (!created && vote) {
          return post.increment({voteCount: 2, likeCount: 2});
        }
        return null;
      })
      .then(function () {
        return post;
      })
      .catch(function (e) {
        return e;
      });
  };

  var dislike = function (uid, user) {
    var post;
    return findOneByUid(uid)
      .then(function (findPost) {
        if (!findPost) {
          return new ComposerError('No Post');
        }
        post = findPost;
        return Model.Vote.findOne({
          where: {
            liker: user.get('id'),
            votable: 'post',
            votableId: post.get('uid')
          }
        });
      })
      .then(function (vote) {
        if (!vote) {
          return Model.Vote.create({
              liker: user.get('id'),
              votable: 'post',
              votableId: post.get('uid'),
              kind: 0
            })
                          .then(function (createdVote) {
              if (createdVote) {
                return post.decrement({voteCount: 1, likeCount: 1});
              }
              return null;
            });
        }
        return null;
      })
      .then(function () {
        return post;
      })
      .catch(function (e) {
        return e;
      });
  };

  var dislikeFromLike = function (uid, user) {
    var post;
    return findOneByUid(uid)
      .then(function (findPost) {
        if (!findPost) {
          return new ComposerError('No Post');
        }
        post = findPost;
        return Model.Vote.update({
          kind: 0
        }, {
          where: {
            liker: user.get('id'),
              votable: 'post',
              votableId: post.get('uid'),
              kind: 1
          }
        });
      })
      .spread(function (vote, created) {
        if (!created && vote) {
          return post.decrement({voteCount: 2, likeCount: 2});
        }
        return null;
      })
      .then(function () {
        return post;
      })
      .catch(function (e) {
        return e;
      });
  };

  var search = function search(query) {
    console.log(query);
    return Model.Post
      .findAll({
        where: {
          $or: {
            title: {$like: '%' + query + '%'},
            content: {$like: '%' + query + '%'}
          }
        }
      })
      .then(function (posts) {
        return posts;
      })
      .catch(function (e) {
        return e;
      });
  };

  var findPostAll = function findPostAll(options) {
    var prop = {
      page: options.page || 1,
      limit: options.limit || 10
    };

    return Model
      .Post
      .findAndCountAll({
        offset: (prop.page - 1) * prop.limit,
        limit: prop.limit,
        '$Related.Related' : 1,
        include: [
          { model: Model.User, attributes: ['nick'] },
          { model: Model.Club, attributes: ['title', 'url'],
              include: [ { model: Model.ClubGroup, attributes: ['title']} ]
          },
          { model: Model.Prefix, attributes: ['name'] },
          { model: Model.Tag, attributes: ['name'] },
          { model: Model.Comment,
              include: [ { model: Model.SubComment } ]
          },
        ]
      })
      .then(function () {
        var permissionType = {
          readClub: 'readClub',
          writeClub: 'writeClub',
          readPost: 'readPost',
          writePost: 'writePost',
          readComment: 'readComment',
          writeComment: 'writeComment'
        };
        var gradeName = {
          normal: '일반',
          bronze: '브론즈',
          silver: '실버',
          gold: '골드',
          diamond: '다이아몬드'
        };

        return Model
          .Club
          .findAndCountAll({
            where: { id : 1 },
            include: [
              Model.ClubSetting,
              {
                model: Model.ClubPermission,
                include: [
                  { model: Model.MembershipPermission, where: { permission_value: 1 },
                    include: [ Model.Membership, {model: Model.Permission, where: { type: permissionType.readClub }}]
                  },
                  { model: Model.GradePermission, where: {permission_value: 1 },
                    include: [
                      { model: Model.Grade, where: { name: gradeName.bronze }},
                      { model: Model.Permission, where: { type: permissionType.readClub }}
                    ]
                  },
                  { model: Model.ProfilePermission,
                    include: [{model: Model.Permission, where: { type: permissionType.readClub }}]
                  }
                ]
              },
              Model.Prefix
            ]
          });
      })
      .then(function (postList) {
        return {
          page: prop.page,
          limit: prop.limit,
          total: postList.count,
          data: postList.rows
        };
      });
  };
  var findMainPostAll = function findMainPostAll() {
    var options = {
      page: 1,
      limit: 10
    };

    return findPostAll(options);
  };
  return {
    createPost: createPost,
    findBest: findBest,
    findOneByUid: findOneByUid,
    findPostByClub: findPostByClub,
    findOneByClub: findOneByClub,
    findPostUserCreated: findPostUserCreated,
    like: like,
    dislike: dislike,
    likeFromDislike: likeFromDislike,
    dislikeFromLike: dislikeFromLike,
    search: search,

    findPostAll: findPostAll,
    findMainPostAll: findMainPostAll,
  };
})();
