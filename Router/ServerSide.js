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

  next();
});

router.get('/signin', function (req, res) {
  res.send();
});

router.get('/club', function (req, res) {
  Goblin('Composer', function (G) {
    var result = res.resultData;

    G
      .Club
      .findClubList()
      .then(function(clubLists) {
        assign(result, {ClubListStore: clubLists});
        res.send(result);
      });
  });
});

router.get('/', function (req, res) {
  Goblin('Composer', function (G) {
    var result = res.resultData;

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
});

router.get('/club/:clubUrl', function (req, res) {
  Goblin('Composer', function (G) {
    var result = res.resultData;

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
    var result = res.resultData;

    G
      .Club
      .findClubList()
      .then(function(clubLists) {
        assign(result, { ClubListStore: clubLists});

        return G
          .Club
          .findClubPrefix(req.params.clubUrl);
      })
      .then(function (clubPrefix) {
        assign(result, { SubmitSectionStore: clubPrefix});

        res.send(result);
      });
  });
});

router.get('/club/:clubUrl/:postId', function (req, res) {
  Goblin('Composer', function (G) {
    var result = res.resultData;

    var reqPage = req.query.p || 1;

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
          .findClubPostAll({page: reqPage, limit: 10, url: req.params.clubUrl});
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
  var result = res.resultData;
  res.send(result);
});

router.get('/community', function (req, res) {
  var query = req.query;

  new Promise(function (resolve, reject) {
    if (!query.fid) {
      throw reject();
    }

    if (query && query.fid) {

      var a = {
        skin: 1
      }

      resolve(a);
    }
  })
  .then(function (result) {
    res.send(result);
  })
  .catch(function () {
    res.send();
  })
});

// ------------------------------------------------------------------------- //


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
