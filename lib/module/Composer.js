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
var Vote = Model.vote;
var Comment = Model.comment;

// Error Module
function ComposerError(message) {
  this.name = 'ComposerError';
  this.message = message || '서버 에러';
}
ComposerError.prototype = new Error();
ComposerError.prototype.constructor = ComposerError;

// Module
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
          throw new ComposerError('undefined email');
        }
        if (!user.nick) {
          throw new ComposerError('undefined nick');
        }
        if (!user.password) {
          throw new ComposerError('undefined password');
        }
        return true;
      };

      var findOneByUser = function (user) {
        return User
          .findOne({where: user})
          .then(function (findUser) {
            if (!findUser) {
              throw new ComposerError('No User');
            }
            return findUser;
          });
      };

      var signin = function (user) {
        return User
          .findOrCreate({where: user})
          .spread(function (newUser, created) {
            if (!created) {
              return new ComposerError('Already signin User');
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
          if (!token) {
            return resolve(false);
          }

          jsonwebtoken.verify(token, 'secret', function (err, decoded) {
            if (err) {
              if (err.name === 'JsonWebTokenError') {
                return reject(err);
              }
              if (err.name === 'TokenExpiredError') {
                return reject(err);
              }
            }
            var u = {
              id: decoded.id,
              email: decoded.email
            };

            return findOneByUser(u)
              .then(function (user) {
                return resolve(user);
              })
              .catch(function (error) {
                return reject(error);
              });
          });
        });
      };

      var needLogin = function (token) {
        return new Promise(function (resolve, reject) {
          if (!token) {
            throw new ComposerError('Not Login');
          }

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
            delete decoded.exp;
            return findOneByUser({id: decoded.id})
              .then(function (user) {
                return resolve(user);
              });
          });
        });
      };

      var login = function (user) {
        return findOneByUser(user)
          .then(function (findUser) {
            return jsonwebtoken.sign(findUser, 'secret', {expiresIn: '7d'});
          });
      };

      var remove = function (user) {
        return findOneByUser(user)
          .then(function (findUser) {
            return User.destroy({where: findUser});
          });
      };

      return {
        findOneByUser: findOneByUser,
        signin: signin,
        setToken: setToken,
        isLogin: isLogin,
        needLogin: needLogin,
        login: login,
        remove: remove
      };
    })();

    G.Post = (function () {
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
        return G.Club.findOneByUrl(clubName)
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
        return G.Club.findOneByUrl(clubName)
          .then(function (findClub) {
            return findClub.getClubHas({
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
        return G.User.findOneByUser(user)
          .then(function (findUser) {
            return findUser.getUserCreatedClubs();
          });
      };

      var findUserSubs = function (user) {
        return G.User.findOneByUser(user)
          .then(function (findUser) {
            return findUser.getUserSubscribedClubs();
          });
      };

      return {
        findAll: findAll,
        findOne: findOne,
        findOneByUrl: findOneByUrl,
        findDefaults: findDefaults,
        createDefault: createDefault,
        findUserCreated: findUserCreated,
        findUserSubs: findUserSubs
      };
    })();

    G.Comment = (function () {
      // public
      var findInPost = function (postId) {
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
          where: {hierarchyLevel: 1, postId: postId}
        })
        .then(function (comments) {
          _timeSet(comments);

          return comments;
        });
      };

      return {
        findInPost: findInPost
      };
    })();
  };
};
