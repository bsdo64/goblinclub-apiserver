/**
 * Created by dobyeongsu on 2015. 10. 25..
 */
var express = require('express');
var router = express.Router();

var jsonWebToken = require('jsonwebtoken');
var _ = require('lodash');
var shortId = require('shortid');
var moment = require('moment');

var Model = require('../db');
var Post = Model.post;
var User = Model.user;
var Club = Model.club;
var Comment = Model.comment;

var Goblin = require('../lib/index');

moment.locale('ko');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/best', function (req, res) {
  var result = {
    PostStore: {},
    ClubStore: {}
  };

  Goblin('Composer', function (G) {
    G.Post.findBest()
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

router.post('/login', function (req, res) {
  var user = req.body.user;
  Goblin('Composer', 'Validator', function (G) {
    G.validate.loginUser(user)
      .then(function (validateUser) {
        return G.User.login(validateUser);
      })
      .then(function (token) {
        res.cookie('token', token, {
          expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
          httpOnly: true
        });

        res.json({
          token: token,
          user: user,
          message: 'Loggined!'
        });
      })
      .catch(function (err) {
        if (err.name === 'ComposerError') {
          res.status(404).json(err);
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
  var user = req.body.user;
  var newUser = {
    email: user.signinEmail,
    nick: user.signinNick,
    password: user.signinPassword
  };

  User.findOrCreate({
    where: newUser
  }).spread(function (user) {
    console.log(user.get({
      plain: true
    }));
    try {
      var token = jsonWebToken.sign(user, 'secret', {expiresIn: '7d'});

      res.cookie('token', token, {
        expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
        httpOnly: true
      });

      res.json({
        token: token,
        user: user,
        message: 'Loggined!'
      });
    }catch (err) {
      res.json({
        message: 'can\'t make token',
        error: err
      });
    }
  }).catch(function (err) {
    res.json({
      type: 'signinUser',
      message: '회원가입 오류',
      error: err
    });
  });
});

router.post('/submit', function (req, res) {
  var post = req.body.post;
  var author = req.body.author;

  var createdPost, clubList = [];

  if (!post || !author) {
    res.status(400).json({
      message: 'Fill out',
      error: 'Fill out'
    });
  }

  User.find({
    where: author
  }).then(function (user) {
    return Post.create({
      uid: shortId.generate(),
      title: post.title,
      content: post.content,
      author: user.get('id')
    });
  }).then(function (newPost) {
    createdPost = newPost;
    clubList.push(post.defaultClubList);
    clubList.push(post.subscribeClubList);
    _.flatten(clubList, true);
    _.compact(clubList);

    return Club.findAll({where: {id: {$or: clubList}}});
  }).then(function (clubs) {
    return createdPost.setClubs(clubs);
  }).then(function (club_post) {
    var postId = club_post[0][0].get()['postId'];
    console.log(postId);
    return Post.find({
      where: {uid: postId},
      include: [
        {model: User, required: true, attributes: ['nick', 'id']},
        {model: Club, required: true, as: 'belongingClubs'}
      ]
    });
  }).then(function (post) {
    console.log(post);
    res.send(post);
  });
});

router.get('/club/:clubName', function (req, res) {
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

router.get('/', function (req, res) {
  res.json({a: 1});
});

module.exports = router;
