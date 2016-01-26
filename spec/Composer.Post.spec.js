/**
 * Created by dobyeongsu on 2015. 12. 19..
 */

describe('Composer Test - Post', function () {
  var Goblin = require('../lib/index');
  var assign = require('object-assign');
  var user = require('./helpers/data.json').user;
  var defaultClub = require('./helpers/data.json').club.default;
  var createdClub = require('./helpers/data.json').club.create;

  it('Composer Module', function (done) {
    Goblin('Composer', 'Validator', function (G) {
      expect(G.User.findOneByUser).toBeDefined();
      expect(G.User.signin).toBeDefined();
      expect(G.User.setToken).toBeDefined();
      expect(G.User.isLogin).toBeDefined();
      expect(G.User.needLogin).toBeDefined();
      expect(G.User.login).toBeDefined();
      expect(G.User.removeOneByUser).toBeDefined();

      expect(G.Post.createPost).toBeDefined();
      expect(G.Post.findBest).toBeDefined();
      expect(G.Post.findPostByClub).toBeDefined();
      expect(G.Post.findPostUserCreated).toBeDefined();
      expect(G.Post.like).toBeDefined();
      expect(G.Post.dislike).toBeDefined();
      expect(G.Post.unlike).toBeDefined();
      expect(G.Post.undislike).toBeDefined();
      done();
    });
  });


  describe('Post - ', function () {
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
              });
          })
          .then(function () {
            return G.Club.findUserCreated(user);
          })
          .then(function (clubs) {
            expect(clubs.length).toEqual(2);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    it('create post', function (done) {
      Goblin('Composer', function (G) {
        var post = {
          title: 'testpost',
          content: 'testpost'
        };

        G.Club
          .findUserCreated(user)
          .then(function (clubs) {
            var club1 = clubs[0];
            var club2 = clubs[1];

            assign(post, {
              defaultClubList: club1.get('id'),
              subscribeClubList: [club2.get('id')],
              author: user.id
            });

            return G.Post.createPost(post, user);
          })
          .then(function (sample) {
            var sampleJS = sample.get({plain: true});
            expect(sampleJS.title).toEqual(post.title);
            expect(sampleJS.content).toEqual(post.content);
            expect(sampleJS.author).toEqual(user.id);
            expect(sampleJS.belongingClubs.length).toEqual(2);
            done();
          });
      });
    });

    it('find best posts', function (done) {
      Goblin('Composer', function (G) {
        G.Post
          .findBest()
          .then(function (posts) {
            expect(posts.length).toEqual(1);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    it('find posts by url', function (done) {
      Goblin('Composer', function (G) {
        G.Post
          .findPostByClub(defaultClub.url)
          .then(function (posts) {
            expect(posts.length).toEqual(1);
            done();
          })
          .catch(function (err) {
            done.fail(err);
          });
      });
    });

    it('find posts user created', function (done) {
      Goblin('Composer', function (G) {
        var u = {
          email: user.email
        };
        G.Post
          .findPostUserCreated(u)
          .then(function (posts) {
            expect(posts.length).toEqual(1);
            done();
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
