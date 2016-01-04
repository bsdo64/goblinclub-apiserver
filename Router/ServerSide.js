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

moment.locale('ko');

router.get('/', function (req, res) {
  var token = req.headers.token;

  var result = {
    PostStore: {},
    ClubStore: {
      userHas: {}
    },
    UserStore: {
      auth: {},
      loadingAuth: false,
      loadedAuth: false,
      authFail: false,
      authSuccess: false
    }
  };

  Goblin('Composer', 'Validator', function (G) {
    G.Post.findBest()
      .then(function (posts) {
        result.PostStore.bestList = posts;

        return G.Club.findDefaults();
      })
      .then(function (clubs) {
        result.ClubStore.defaultClubList = clubs;

        console.log(clubs);
        return G.User.isLogin(token);
      })
      .then(function (isLogin) {
        if (isLogin) {
          result.UserStore.auth.user = isLogin;
          result.UserStore.loadedAuth = true;
          result.UserStore.authFail = false;
          result.UserStore.authSuccess = true;

          var findUser = isLogin;
          G.Club.findUserCreated(findUser)
            .then(function (created) {
              result.ClubStore.userHas.createdClubList = created;

              return G.Club.findUserSubs(findUser);
            })
            .then(function (subs) {
              result.ClubStore.userHas.subscribedClubList = subs;

              console.log('a');
              res.send(result);
            });
        } else {
          console.log('b');
          res.send(result);
        }
      })
      .catch(function (e) {
        console.log(e);

        res.status(404).send(e);
      });
  });
});

router.get('/club/:clubName', function (req, res) {
  var token = req.headers.token;
  var clubName = req.params.clubName;

  var result = {
    ClubStore: {
      userHas: {}
    },
    PostStore: {}
  };

  Goblin('Composer', 'Validator', function (G) {
    G.Post.findPostByClub(clubName)
      .then(function (posts) {
        result.PostStore.postList = posts;

        return G.Club.findDefaults();
      })
      .then(function (clubs) {
        result.ClubStore.defaultClubList = clubs;

        return G.User.isLogin(token);
      })
      .then(function (isLogin) {
        if (isLogin) {
          var findUser = isLogin;
          G.Club.findUserCreated(findUser)
            .then(function (created) {
              result.ClubStore.userHas.createdClubList = created;

              return G.Club.findUserSubs(findUser);
            })
            .then(function (subs) {
              result.ClubStore.userHas.subscribedClubList = subs;

              console.log('a');
              res.send(result);
            });
        } else {
          console.log('b');
          res.send(result);
        }
      })
      .catch(function (e) {
        console.log(e);

        res.status(404).send(e);
      });
  });
});

router.get('/club/:clubName/submit', function (req, res) {
  var user = req.query.user;

  var result = {
    PostStore: {},
    ClubStore: {
      userHas: {}
    }
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
  var token = req.headers.token;

  var result = {
    ClubStore: {
      userHas: {}
    }
  };

  Goblin('Composer', function (G) {
    var findUser;
    G.User.needLogin(token)
      .then(function (user) {
        findUser = user;

        return G.Club.findDefaults();
      })
      .then(function (clubs) {
        result.ClubStore.defaultClubList= clubs;

        return G.Club.findUserCreated(findUser);
      })
      .then(function (created) {
        result.ClubStore.userHas.createdClubList = created;

        return G.Club.findUserSubs(findUser);
      })
      .then(function (subs) {
        result.ClubStore.userHas.subscribedClubList = subs;

        res.send(result);
      })
      .catch(function (err) {
        res.status(404).send(err);
      });
  });
});

router.get('/notfound', function (req, res) {
  var token = req.headers.token;

  var result = {
    ClubStore: {
      userHas: {}
    }
  };

  Goblin('Composer', function (G) {
    var findUser;
    G.Club.findDefaults()
      .then(function (clubs) {
        result.ClubStore.defaultClubList = clubs;

        return G.User.isLogin(token);
      })
      .then(function (isLogin) {
        findUser = isLogin;
        if (isLogin) {
          G.Club.findUserCreated(findUser)
            .then(function (created) {
              result.ClubStore.userHas.createdClubList = created;

              return G.Club.findUserSubs(findUser);
            })
            .then(function (subs) {
              result.ClubStore.userHas.subscribedClubList = subs;

              res.send(result);
            });
        } else {
          res.send(result);
        }
      })
      .catch(function (err) {
        res.status(404).send(err);
      });
  });
});

router.get('/club/:clubName/:postName', function (req, res) {
  var postName = req.params.postName;
  var clubName = req.params.clubName;
  var token = req.headers.token;

  var result = {
    PostStore: {
      readingPost: {},
      postList: [],
      commentList: []
    },
    ClubStore: {
      defaultClubList: [],
      userHas: {
        createdClubList: [],
        subscribedClubList: []
      }
    }
  };

  Goblin('Composer', 'Validator', function (G) {
    G.Post.findOneByClub(clubName, postName)
      .then(function (post) {
        result.PostStore.readingPost = post;

        return G.Comment.findInPost(postName);
      })
      .then(function (comments) {
        result.PostStore.commentList = comments;

        return G.Post.findPostByClub(clubName);
      })
      .then(function (posts) {
        result.PostStore.postList = posts;

        return G.Club.findDefaults();
      })
      .then(function (clubs) {
        result.ClubStore.defaultClubList = clubs;

        return G.User.isLogin(token);
      })
      .then(function (isLogin) {

        if (isLogin) {
          var findUser = isLogin;
          G.Club.findUserCreated(findUser)
            .then(function (created) {
              result.ClubStore.userHas.createdClubList = created;

              return G.Club.findUserSubs(findUser);
            })
            .then(function (subs) {
              result.ClubStore.userHas.subscribedClubList = subs;

              res.send(result);
            });
        } else {
          res.send(result);
        }
      })
      .catch(function (e) {
        res.status(404).send(e);
      });
  });
});

module.exports = router;
