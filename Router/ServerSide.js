/**
 * Created by dobyeongsu on 2015. 10. 25..
 */
var express = require('express');
var router = express.Router();

var moment = require('moment');
moment.locale('ko');

var Goblin = require('../lib/index');

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

router.get('/club/:clubName', function (req, res) {
  var p = req.query.p;
  var token = req.headers.token;
  var clubName = req.params.clubName;

  var result = {
    ClubStore: {
      userHas: {}
    },
    PostStore: {}
  };

  Goblin('Composer', 'Validator', function (G) {
    G.Post.findPostByClub(clubName, p)
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

router.get('/submit/club', function (req, res) {
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
        result.ClubStore.defaultClubList = clubs;

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

module.exports = router;
