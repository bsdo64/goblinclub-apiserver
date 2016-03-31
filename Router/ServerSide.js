/**
 * Created by dobyeongsu on 2015. 10. 25..
 */
var express = require('express');
var router = express.Router();

var moment = require('moment');
moment.locale('ko');

var Goblin = require('../lib/index');

router.use('/', function (req, res, next) {
  var token = req.headers.token;
  var result = {
    UserStore: {}
  };

  next();
});

router.get('/signin', function (req, res) {
  res.send();
});

router.get('/club', function (req, res) {
  res.send();
});

router.get('/', function (req, res) {

  Goblin('Composer', function (G) {
    G
      .Post
      .findMainPostAll()
      .then(function (data) {
        res.send(data);
      });
  });

  // Goblin('Composer', 'Validator', function (G) {
  //   var p = req.query.p;
  //   var token = req.headers.token;
  //
  //   G.User.isLogin(token)
  //     .then(function (user) {
  //       G.Post.findBest(p, user)
  //         .then(function (posts) {
  //           res.resultData.PostStore.bestList = posts;
  //
  //           res.send(res.resultData);
  //         })
  //         .catch(function (e) {
  //           res.status(404).send(e);
  //         });
  //     });
  // });
});

router.get('/club/:clubUrl', function (req, res) {
  res.send();
});

router.get('/club/:clubUrl/:postId', function (req, res) {
  res.send();
});

router.get('/submit', function (req, res) {
  res.send();
});

router.get('/submit/:clubUrl', function (req, res) {
  res.send();
});

router.get('/search/:query', function (req, res) {
  Goblin('Composer', 'Validator', function (G) {
    var q = req.params.query;

    G.Post.search(q)
      .then(function (searchPosts) {
        res.resultData.SearchStore.post = searchPosts;

        res.send(res.resultData);
      })
      .catch(function (e) {
        res.status(404).send(e);
      });
  });
});

router.get('/club/:clubName', function (req, res) {
  var p = req.query.p;
  var clubName = req.params.clubName;

  Goblin('Composer', 'Validator', function (G) {
    G.Post.findPostByClub(clubName, p)
      .then(function (posts) {
        res.resultData.PostStore.postList = posts;

        res.send(res.resultData);
      })
      .catch(function (e) {
        res.status(404).send(e);
      });
  });
});

router.get('/club/:clubName/:postName', function (req, res) {
  var postName = req.params.postName;
  var clubName = req.params.clubName;

  Goblin('Composer', 'Validator', function (G) {
    G.Post.findOneByClub(clubName, postName)
      .then(function (post) {
        res.resultData.PostStore.readingPost = post;

        return G.Comment.findByPostId(postName);
      })
      .then(function (comments) {
        res.resultData.PostStore.commentList = comments;

        return G.Post.findPostByClub(clubName);
      })
      .then(function (posts) {
        res.resultData.PostStore.postList = posts;

        res.send(res.resultData);
      })
      .catch(function (e) {
        res.status(404).send(e);
      });
  });
});

router.get('/submit', function (req, res) {
  var token = req.headers.token;

  Goblin('Composer', function (G) {
    G.User.needLogin(token)
      .then(function (user) {

        res.send(res.resultData);
      })
      .catch(function (err) {
        res.status(404).send(err);
      });
  });
});

router.get('/submit/club', function (req, res) {
  var token = req.headers.token;

  Goblin('Composer', function (G) {
    G.User.needLogin(token)
      .then(function (user) {
        res.send(res.resultData);
      })
      .catch(function (err) {
        res.status(404).send(err);
      });
  });
});

router.get('/notfound', function (req, res) {
  res.send(res.resultData);
});

module.exports = router;
