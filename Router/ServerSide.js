/**
 * Created by dobyeongsu on 2015. 10. 25..
 */
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var moment = require('moment');

var Model = require('../db');
var User = Model.user;
var Post = Model.post;
var Club = Model.club;
var Comment = Model.comment;

var Goblin = require('../lib/index');
var Composerconf = require('../lib/config/Composer');

moment.locale('ko');

router.use(function (req, res, next) {
  Goblin('Composer', function (G) {
    var conf = Composerconf[req.baseUrl]['/'];
    var result = {
      PostStore: {},
      ClubStore: {}
    };

    G.Post.findAll(conf[0])
    .then(function (posts) {

      return G.Club.findAll(conf[1]);
    });
  });
  next();
});

router.get('/', function (req, res) {
  var user = req.query.user;

  var result = {
    PostStore: {},
    ClubStore: {}
  };

  var findUser;

  Post.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    include: [
      {model: User, required: true, attributes: ['nick', 'id']},
      {model: Club, required: true}
    ]
  }).then(function (bestPosts) {
    _.map(bestPosts, function (bestPost) {
      bestPost.setDataValue('createdAt', moment(bestPost.createdAt).fromNow());
      bestPost.setDataValue('updatedAt', moment(bestPost.updatedAt).fromNow());
      return bestPost;
    });
    result.PostStore.bestList = bestPosts;

    return Club.findAll({where: {type: 'default'}});
  }).then(function (defaultClubs) {
    result.ClubStore.defaultClubList = defaultClubs;

    if (user && user.email) {
      User
        .find({where: {email: user.email}})
        .then(function (userFound) {
          findUser = userFound;
          return Club.findAll({where: {creator: userFound.id}});
        })
        .then(function (userCreatedClubList) {
          result.ClubStore.userHas = {
            createdClubList: userCreatedClubList
          };
          return findUser.getUserSubscribedClubs();
        })
        .then(function (userSubscribedClubs) {
          result.ClubStore.userHas = {
            subscribedClubList: userSubscribedClubs
          };

          res.send(result);
        });
    } else {
      res.send(result);
    }
  });
});

router.get('/club/:clubName', function (req, res) {
  var user = req.query.user;

  var result = {
    ClubStore: {},
    PostStore: {}
  };

  Club
    .findAll({where: {type: 'default'}})
    .then(function (defaultClubs) {
      result.ClubStore.defaultClubList = defaultClubs;

      return Club.find({where: {url: req.params.clubName}}).then(function (club) {
        if (!club) {
          return [];
        }
        return club.getPosts({
          order: [['createdAt', 'DESC']],
          include: [User, Club]
        });
      });
    })
    .then(function (posts) {
      _.map(posts, function (post) {
        post.setDataValue('createdAt', moment(post.createdAt).fromNow());
        post.setDataValue('updatedAt', moment(post.updatedAt).fromNow());
        return post;
      });
      result.PostStore.postList = posts;
    })
    .then(function () {
      if (user && user.email) {
        var findUser;
        User
          .find({where: {email: user.email}})
          .then(function (user) {
            findUser = user;
            return Club.findAll({where: {creator: user.id}});
          })
          .then(function (userCreatedClubList) {
            result.ClubStore.userHas = {
              createdClubList: userCreatedClubList
            };
            return findUser.getUserSubscribedClubs();
          })
          .then(function (userSubscribedClubs) {
            result.ClubStore.userHas = {
              subscribedClubList: userSubscribedClubs
            };

            res.send(result);
          });
      } else {
        res.send(result);
      }
    });
});

router.get('/club/:clubName/submit', function (req, res) {
  var user = req.query.user;

  var result = {
    PostStore: {},
    ClubStore: {}
  };

  var findUser;

  Club
    .findAll({where: {type: 'default'}})
    .then(function (defaultClubs) {
      result.ClubStore.defaultClubList = defaultClubs;

      if (user && user.email) {
        User
          .find({where: {email: user.email}})
          .then(function (user) {
            findUser = user;
            return Club.findAll({where: {creator: user.id}});
          })
          .then(function (userCreatedClubList) {
            result.ClubStore.userHas = {
              createdClubList: userCreatedClubList
            };
            return findUser.getUserSubscribedClubs();
          })
          .then(function (userSubscribedClubs) {
            result.ClubStore.userHas = {
              subscribedClubList: userSubscribedClubs
            };

            res.send(result);
          });
      } else {
        res.send(result);
      }
    });
});

router.get('/submit', function (req, res) {
  var user = req.query.user;

  var result = {
    ClubStore: {}
  };

  var findUser;

  Club
    .findAll({where: {type: 'default'}})
    .then(function (defaultClubs) {
      result.ClubStore.defaultClubList = defaultClubs;

      if (user && user.email) {
        User
          .find({where: {email: user.email}})
          .then(function (user) {
            findUser = user;
            return Club.findAll({where: {creator: user.id}});
          })
          .then(function (userCreatedClubList) {
            result.ClubStore.userHas = {
              createdClubList: userCreatedClubList
            };
            return findUser.getUserSubscribedClubs();
          })
          .then(function (userSubscribedClubs) {
            result.ClubStore.userHas = {
              subscribedClubList: userSubscribedClubs
            };

            res.send(result);
          });
      } else {
        res.send(result);
      }
    });
});

router.get('/club/:clubName/:postName', function (req, res) {
  var user = req.query.user;
  var postName = req.params.postName;
  var clubName = req.params.clubName;

  var result = {
    PostStore: {},
    ClubStore: {}
  };

  var postId;
  var findUser;

  Post.findOne({
    where: {uid: postName},
    include: [
      {model: User, required: true, attributes: ['nick', 'id']},
      {model: Club, required: true}
    ]
  }).then(function (post) {
    postId = post.uid;
    post.setDataValue('createdAt', moment(post.createdAt).fromNow());
    post.setDataValue('updatedAt', moment(post.updatedAt).fromNow());
    result.PostStore.readingPost = post;
  }).then(function () {
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
    });
  }).then(function (comments) {
    console.log(JSON.parse(JSON.stringify(comments)));
    result.PostStore.commentList = comments;

    return Club.find({where: {url: clubName}}).then(function (club) {
      if (!club) {
        return [];
      }
      return club.getPosts({
        order: [['createdAt', 'DESC']],
        include: [User, Club]
      });
    });
  }).then(function (posts) {
    _.map(posts, function (post) {
      post.setDataValue('createdAt', moment(post.createdAt).fromNow());
      post.setDataValue('updatedAt', moment(post.updatedAt).fromNow());
      return post;
    });
    result.PostStore.postList = posts;

    return Club.findAll({where: {type: 'default'}});
  }).then(function (defaultClubs) {
    result.ClubStore.defaultClubList = defaultClubs;
    if (user && user.email) {
      User.find({
        where: {email: user.email}
      }).then(function (user) {
        findUser = user;
        return Club.findAll({where: {creator: user.id}});
      }).then(function (userCreatedClubList) {
        result.ClubStore.userHas = {
          createdClubList: userCreatedClubList
        };
        return findUser.getUserSubscribedClubs();
      }).then(function (userSubscribedClubs) {
        result.ClubStore.userHas = {
          subscribedClubList: userSubscribedClubs
        };

        res.send(result);
      });
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
