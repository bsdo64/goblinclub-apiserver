/**
 * Created by dobyeongsu on 2015. 10. 25..
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');
moment.locale('ko');

var Goblin = require('../lib/index');

router.get('/best', function (req, res) {
  var p = req.query.p;
  var token = req.cookies.token;

  var result = {
    PostStore: {},
    ClubStore: {}
  };

  Goblin('Composer', function (G) {
    G.User
      .isLogin(token)
      .then(function (user) {
        G.Post.findBest(p, user)
          .then(function (posts) {
            result.PostStore.bestList = posts;
            return G.Club.findDefaults();
          })
          .then(function (clubs) {
            result.ClubStore.defaultClubList = clubs;
            res.json(result);
          })
          .catch(function (err) {
            res.status(404).json(err);
          });
      });
  });
});

router.post('/search/:query', function (req, res) {
  Goblin('Composer', 'Validator', function (G) {
    var q = req.params.query;

    G.Post.search(q)
      .then(function (searchPosts) {
        res.send({
          result: 'ok',
          posts: searchPosts
        });
      })
      .catch(function (e) {
        console.log(e);
        res.status(404).send(e);
      });
  });
});

router.post('/login', function (req, res) {
  var user = {
    email: req.body.email,
    password: req.body.password
  };
  Goblin('Composer', 'Validator', function (G) {
    G.validate.loginUser(user)
      .then(function (validateUser) {
        return G.User.login(validateUser);
      })
      .then(function (result) {
        res.cookie('token', result.token, {
          expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
          httpOnly: true
        });

        res.json({
          user: result.user,
          message: 'Loggined!'
        });
      })
      .catch(function (err) {
        if (err.name === 'ComposerError') {
          res.status(404).json(err);
        } else if (err.isJoi) {
          res.status(404).json({
            type: 'Fatal Error',
            message: '심각한 오류',
            error: err
          });
        } else if (err.name === 'ValidationError') {
          res.status(404).json(err);
        } else {
          res.status(404).json({
            type: 'Fatal Error',
            message: '심각한 오류',
            error: err
          });
        }
      });
  });
});

router.post('/signin', function (req, res) {
  var newUser = {
    email: req.body.signinEmail,
    nick: req.body.signinNick,
    password: req.body.signinPassword
  };

  Goblin('Composer', 'Validator', function (G) {
    G.validate.signinUser(newUser)
      .then(function (validatedUser) {
        return G.User.signin(validatedUser);
      })
      .then(function (result) {
        res.cookie('token', result.token, {
          expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
          httpOnly: true
        });

        res.json({
          user: result.user
        });
      })
      .catch(function (err) {
        res.json({
          message: 'can\'t make token',
          error: err
        });
      });
  });
});

router.post('/post/like/:uid', function (req, res) {
  var token = req.cookies.token;
  var uid = req.params.uid;

  Goblin('Composer', 'Validator', function (G) {
    G.User.isLogin(token)
      .then(function (user) {
        if (user) {
          G.Post.like(uid, user)
            .then(function (post) {
              res.json({result: 'ok'});
            });
        } else {
          res.json({
            message: 'Not Logined',
            error: 'Not Logined'
          });
        }
      })
      .catch(function (err) {
        res.json({
          message: 'can\'t make token',
          error: err
        });
      });
  });
});

router.post('/post/dislike/:uid', function (req, res) {
  var token = req.cookies.token;
  var uid = req.params.uid;

  Goblin('Composer', 'Validator', function (G) {
    G.User.isLogin(token)
      .then(function (user) {
        if (user) {
          G.Post.dislike(uid, user)
            .then(function (post) {
              res.json({result: 'ok'});
            });
        } else {
          res.json({
            message: 'Not Logined',
            error: 'Not Logined'
          });
        }
      })
      .catch(function (err) {
        res.json({
          message: 'can\'t make token',
          error: err
        });
      });
  });
});

router.post('/post/dislikeFromLike/:uid', function (req, res) {
  var token = req.cookies.token;
  var uid = req.params.uid;

  Goblin('Composer', 'Validator', function (G) {
    G.User.isLogin(token)
      .then(function (user) {
        if (user) {
          G.Post.dislikeFromLike(uid, user)
            .then(function (post) {
              res.json({result: 'ok'});
            });
        } else {
          res.json({
            message: 'Not Logined',
            error: 'Not Logined'
          });
        }
      })
      .catch(function (err) {
        res.json({
          message: 'can\'t make token',
          error: err
        });
      });
  });
});

router.post('/post/likeFromDislike/:uid', function (req, res) {
  var token = req.cookies.token;
  var uid = req.params.uid;

  Goblin('Composer', 'Validator', function (G) {
    G.User.isLogin(token)
      .then(function (user) {
        if (user) {
          G.Post.likeFromDislike(uid, user)
            .then(function (post) {
              res.json({result: 'ok'});
            });
        } else {
          res.json({
            message: 'Not Logined',
            error: 'Not Logined'
          });
        }
      })
      .catch(function (err) {
        res.json({
          message: 'can\'t make token',
          error: err
        });
      });
  });
});

router.post('/submit/comment', function (req, res) {
  var commentId = req.body.commentId;
  var postId = req.body.postId;
  var content = req.body.content;
  var token = req.cookies.token;

  Goblin('Composer', 'Validator', function (G) {
    G.User.isLogin(token)
      .then(function (isLogin) {
        if (isLogin) {
          return G.Comment.createComment(content, postId, isLogin, commentId)
            .then(function (comment) {
              var result = {
                result: 'ok',
                comment: comment
              };
              res.send(result);
            });
        } else {
          res.status(404).send({
            message: 'Not Logined',
            error: 'Not Logined'
          });
        }
      })
      .catch(function (e) {
        res.status(404).send(e);
      });
  });
});

router.post('/submit/club', function (req, res) {
  var club = req.body;
  var token = req.cookies.token;

  if (!club) {
    res.status(400).json({
      message: 'Fill out',
      error: 'Fill out'
    });
  }

  Goblin('Composer', 'Validator', function (G) {
    G.User.isLogin(token)
      .then(function (isLogin) {
        if (isLogin) {
          return G.Club.createClub(club, isLogin)
            .then(function (newClub) {
              res.send(newClub);
            });
        } else {
          res.status(404).send({
            message: 'Not Logined',
            error: 'Not Logined'
          });
        }
      })
      .catch(function (e) {
        res.status(404).send(e);
      });
  });
});

router.post('/submit', function (req, res) {
  var post = req.body;
  var token = req.cookies.token;

  if (!post) {
    res.status(400).json({
      message: 'Fill out',
      error: 'Fill out'
    });
  }

  Goblin('Composer', 'Validator', function (G) {
    G.User.isLogin(token)
      .then(function (isLogin) {
        if (isLogin) {
          return G.Post.createPost(post, isLogin)
            .then(function (newPost) {
              res.send(newPost);
            });
        } else {
          res.status(404).send({
            message: 'Not Logined',
            error: 'Not Logined'
          });
        }
      })
      .catch(function (e) {
        res.status(404).send(e);
      });
  });
});

router.get('/club/:clubName', function (req, res) {
  var clubName = req.params.clubName;
  var token = req.cookies.token;

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
  var token = req.cookies.token;

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

        return G.Comment.findByPostId(postName);
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

router.get('/', function (req, res) {
  res.json({a: 1});
});

module.exports = router;
