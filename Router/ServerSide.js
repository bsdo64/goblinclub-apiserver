/**
 * Created by dobyeongsu on 2015. 10. 25..
 */
var express = require('express');
var router = express.Router();
var assign = require('deep-assign');
var Promise = require('bluebird');

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
  Goblin('Composer', function (G) {
    G
      .Club
      .findClubList()
      .then(function(clubLists) {
        res.send({ClubListStore: clubLists});
      });
  });
});

router.get('/', function (req, res) {
  Goblin('Composer', function (G) {
    var result = {};

    var comments = [];

    G
      .Post
      .findMainPostAll({page: 1, limit: 10})
      .then(function (data) {
        assign(result, {BestSectionStore: {postsData: data}});

        return G
          .Post
          .findPostIdAllUserLike({page: 1, limit: 10});
      })
      .then(function (data) {
        assign(result, {BestSectionStore: {likesData: data}});

        var posts = result.BestSectionStore.postsData.data;

        return Promise.each(posts, function (post, index, length) {
          return post.getComments()
            .then(function (data) {
              comments.push({
                id: post.get('id'),
                data: data
              });
            });
        });
      })
      .then(function () {
        assign(result, {
          BestSectionStore: {
            commentsData: {
              data: comments,
              total: comments.length,
              page: 1,
              limit: 10
            }
          }
        });

        return G
          .User
          .getStatus();
      })
      .then(function (status) {
        
        
        res.send(result);
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
  Goblin('Composer', function (G) {
    var result = {};

    G
      .Post
      .findClubPostAll({page: 1, limit: 10, url: req.params.clubUrl})
      .then(function (clubPostList) {
        assign(result, { ClubSectionStore : { list : clubPostList }});

        return G
          .Club
          .findClubList();
      })
      .then(function (clubLists) {
        assign(result, { ClubListStore : clubLists });

        return G
          .Club
          .findOneClubByUrl(req.params.clubUrl);
      })
      .then(function (club) {
        assign(result, { ClubSectionStore : { club: club }});

        res.send(result);
      })
      .catch(function (err) {
        console.log(err);
        res.status(404).send(err);
      });
  });
});


router.get('/club/:clubUrl/submit', function (req, res) {
  Goblin('Composer', function (G) {
    var result = {};

    G
      .Club
      .findClubList()
      .then(function(clubLists) {
        result.ClubListStore = clubLists;

        return G
          .Club
          .findClubPrefix(req.params.clubUrl);
      })
      .then(function (clubPrefix) {
        result.SubmitStore = clubPrefix;

        res.send(result);
      });
  });
});

router.get('/club/:clubUrl/:postId', function (req, res) {
  Goblin('Composer', function (G) {
    var result = {};

    G
      .Club
      .findOneClubByUrl(req.params.clubUrl)
      .then(function (club) {
        assign(result, { ClubSectionStore: { club: club } });
        
        return G
          .Post
          .findOneByClubUrl(club, req.params.postId);
      })
      .then(function (post) {
        assign(result, { PostSectionStore: post });
        
        return G
          .Club
          .findClubList();
      })
      .then(function(clubLists) {
        assign(result, {ClubListStore: clubLists});
        
        return G
          .Post
          .findClubPostAll({page: 1, limit: 10, url: req.params.clubUrl});
      })
      .then(function (clubPostList) {
        assign(result, { ClubSectionStore : { list : clubPostList }});

        res.send(result);
      })
      .catch(function (err) {
        console.log(err);
        res.status(404).send(err);
      });
  });
});

router.get('/profile', function (req, res) {
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

// router.get('/club/:clubName/:postName', function (req, res) {
//   var postName = req.params.postName;
//   var clubName = req.params.clubName;
//
//   Goblin('Composer', 'Validator', function (G) {
//     G.Post.findOneByClub(clubName, postName)
//       .then(function (post) {
//         res.resultData.PostStore.readingPost = post;
//
//         return G.Comment.findByPostId(postName);
//       })
//       .then(function (comments) {
//         res.resultData.PostStore.commentList = comments;
//
//         return G.Post.findPostByClub(clubName);
//       })
//       .then(function (posts) {
//         res.resultData.PostStore.postList = posts;
//
//         res.send(res.resultData);
//       })
//       .catch(function (e) {
//         res.status(404).send(e);
//       });
//   });
// });

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
