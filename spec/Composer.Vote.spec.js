/**
 * Created by dobyeongsu on 2015. 12. 19..
 */

describe('Composer Test - Vote', function () {
  var Goblin = require('../lib/index');
  var assign = require('object-assign');
  var user = require('./helpers/data.json').user;
  var defaultClub = require('./helpers/data.json').club.default;
  var createdClub = require('./helpers/data.json').club.create;
  var testPost = require('./helpers/data.json').post;

  it('Composer Module', function (done) {
    Goblin('Composer', function (G) {
      expect(G.User).toBeDefined();
      expect(G.Post).toBeDefined();
      expect(G.Club).toBeDefined();
      done();
    });
  });

  describe('Vote - ', function () {
    beforeAll(function (done) {
      Goblin('Composer', 'Validator', function (G) {
        var signUser = {
          email: user.email,
          nick: user.nick,
          password: user.password
        };
        G.validate
          .signinUser(signUser)
          .then(function () {
            return G.User.signin(user);
          })
          .then(function (result) {
            user = signUser;
            user.id = result.user.get('id');

            return G.Club.createDefault(defaultClub, result.user)
              .then(function () {
                return G.Club.createClub(createdClub, result.user);
              })
              .then(function () {
                return G.Club.findUserCreated(user);
              })
              .then(function (clubs) {
                var club1 = clubs[0];
                var club2 = clubs[1];

                assign(testPost, {
                  defaultClubList: club1.get('id'),
                  subscribeClubList: [club2.get('id')],
                  author: user.id
                });

                return G.Post.createPost(testPost, result.user);
              });
          })
          .then(function (post) {
            testPost.uid = post.get('uid');
            expect(post.get('title')).toEqual(testPost.title);
            expect(post.get('content')).toEqual(testPost.content);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    it('Post like', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };
        var uid = {
          uid: testPost.uid
        };
        G.Post
          .like(uid, u)
          .then(function (post) {
            expect(post.get('voteCount')).toEqual(1);
            expect(post.get('likeCount')).toEqual(1);
            done();
          })
          .catch(function (e) {
            done.fail(e);
          });
      });
    });

    it('Post dislike', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };
        var uid = {
          uid: testPost.uid
        };
        G.Post
          .dislike(uid, u)
          .then(function (post) {
            expect(post.get('voteCount')).toEqual(0);
            expect(post.get('likeCount')).toEqual(0);
            done();
          })
          .catch(function (e) {
            done.fail(e);
          });
      });
    });

    it('Post unlike', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };
        var uid = {
          uid: testPost.uid
        };
        G.Post
          .unlike(uid, u)
          .then(function (post) {
            expect(post.get('voteCount')).toEqual(-1);
            expect(post.get('likeCount')).toEqual(-1);
            done();
          })
          .catch(function (e) {
            done.fail(e);
          });
      });
    });

    it('Post undislike', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };
        var uid = {
          uid: testPost.uid
        };
        G.Post
          .undislike(uid, u)
          .then(function (post) {
            expect(post.get('voteCount')).toEqual(0);
            expect(post.get('likeCount')).toEqual(0);
            done();
          })
          .catch(function (e) {
            done.fail(e);
          });
      });
    });

    afterAll(function (done) {
      Goblin('Composer', 'Validator', function (G) {
        G.User
          .removeOneByUser(user)
          .then(function (removed) {
            expect(removed).toEqual(1);
            done();
          });
      });
    });
  });
});
