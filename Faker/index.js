/**
 * Created by dobyeongsu on 2016. 1. 12..
 */
/** @module Faker */

var model = require('../db');
var faker = require('faker');
var _ = require('lodash');
var shortId = require('shortid');
var Promise = require('bluebird');
var async = require('async');

var promiseFor = Promise.method(function (condition, action, value) {
  if (!condition(value)) {
    return value;
  }
  return action(value).then(promiseFor.bind(null, condition, action));
});

var Const = {
  USER_CREATE: 10
};

/**
 * Faker Constructor
 * @class
 * @constructor
 */
var Faker = function () {};

/**
 * Faker test method
 * @method
 * @public
 * @param {Object} app Express app instance
 * @return {void}
 */
Faker.prototype.test = function (app) {
  var User = {}, Club = {}, Post = {}, Comment = {};

  promiseFor(function CREATE_USER_LOOP(count) {
    return count < Const.USER_CREATE;
  }, function (count) {
    return model
      .user
      .create({
        email: faker.internet.email(),
        nick: shortId.generate(),
        password: faker.internet.password()
      })
      .then(function (user) {
        User[user.get('id')] = user;

        return model
          .club
          .create({
            name: shortId.generate(),
            url: shortId.generate(),
            description: faker.lorem.sentence(),
            type: 'default',
            creator: user.get('id')
          })
          .then(function (club) {
            club.setCreatedBy(user);
            Club[club.get('id')] = club;

            return model
              .club
              .create({
                name: shortId.generate(),
                url: shortId.generate(),
                description: faker.lorem.sentence(),
                type: 'create',
                creator: user.get('id')
              })
              .then(function (club2) {
                club2.setSubscribedBy(user);
                club2.setCreatedBy(user);
                Club[club2.get('id')] = club2;
              });
          });
      })
      .then(function () {
        return count + 1;
      });
  }, 0).then(function () {
    console.log('Faker - User created');
    return null;
  })
  .then(function () {
    var u = JSON.parse(JSON.stringify(User));
    var c = JSON.parse(JSON.stringify(Club));

    async.forEachOf(c, function (valueC, clubId, callbackC) {
      async.forEachOf(u, function (valueU, userId, callbackU) {
        promiseFor(function CREATE_POST_LOOP(count) {
          return count < Const.USER_CREATE;
        }, function (count) {
          return model
            .post
            .create({
              uid: shortId.generate(),
              title: faker.lorem.sentence(),
              content: '<p class=""><br></p><p class="">' + faker.lorem.paragraphs() + '</p><div class="medium-insert-embeds"> <figure> <div class="medium-insert-embed"> <div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;"><iframe src="https://www.youtube.com/embed/ycSOnGzbNO4?wmode=transparent&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;enablejsapi=1" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;"></iframe></div> </div> </figure> </div><p><br></p>',
              author: userId
            })
            .then(function commentPromise(post) {
              return model.comment.create({
                commentId: shortId.generate(),
                postId: post.get('uid'),
                content: faker.lorem.sentences(),
                author: userId
              })
              .then(function (comment) {
                return model.comment.create({
                  commentId: shortId.generate(),
                  postId: post.get('uid'),
                  content: faker.lorem.sentences(),
                  author: userId,
                  parentCommentId: comment.get('commentId')
                })
                .then(function () {
                  return post;
                });
              });
            })
            .then(function setBelongingClubPromise(post) {
              return post.setBelongingClubs(Club[clubId]);
            })
            .then(function () {
              return model
                .post
                .create({
                  uid: shortId.generate(),
                  title: faker.lorem.sentence(),
                  content: '<p class=""><br></p><p class="">' + faker.lorem.paragraphs() + '</p><div class="medium-insert-embeds"> <figure> <div class="medium-insert-embed"> <div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;"><iframe src="https://www.youtube.com/embed/ycSOnGzbNO4?wmode=transparent&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;enablejsapi=1" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;"></iframe></div> </div> </figure> </div><p><br></p>',
                  author: userId
                });
            })
            .then(function commentPromise(post) {
              return model.comment.create({
                commentId: shortId.generate(),
                postId: post.get('uid'),
                content: faker.lorem.sentences(),
                author: userId
              })
              .then(function (comment) {
                return model.comment.create({
                  commentId: shortId.generate(),
                  postId: post.get('uid'),
                  content: faker.lorem.sentences(),
                  author: userId,
                  parentCommentId: comment.get('commentId')
                })
                .then(function () {
                  return post;
                });
              });
            })
            .then(function setBelongingClubPromise(post) {
              return post
                .setBelongingClubs(Club[clubId])
                .then(function votePromise() {
                  return model.vote.findOrCreate({
                    where: {
                      votable: 'post',
                      votableId: post.get('uid'),
                      liker: userId,
                      kind: 1
                    }
                  }).spread(function (vote, created) {
                    return post.increment({voteCount: 1, likeCount: 1});
                  });
                });
            })
            .then(function () {
              return count + 1;
            });
        }, 0).then(function () {
          callbackU();
        });
      });
      console.log('Faker - Create Post C : ', clubId);
      callbackC();
    });

    app.listen(3001, function () {
      console.log('Goblin Api listening-dev');
    });
  });
};

var Geek = {
  GB: {
    name: '사업',
    url: 'business',
    description: 'Geek of Business',
    type: 'default',
    creator: 1
  },
  GC: {
    name: '고전',
    url: 'classics',
    description: 'Geek of Classics',
    type: 'default',
    creator: 1
  },
  GA: {
    name: '예술',
    url: 'arts',
    description: 'Geek of Arts',
    type: 'default',
    creator: 1
  },
  GCS: {
    name: '컴퓨터',
    url: 'computer',
    description: 'Geek of Computer Science',
    type: 'default',
    creator: 1
  },
  GCC: {
    name: '잡담',
    url: 'communications',
    description: 'Geek of communications',
    type: 'default',
    creator: 1
  },
  GE: {
    name: '공학',
    url: 'engineering',
    description: 'Geek of engineering',
    type: 'default',
    creator: 1
  },
  GH: {
    name: '인문학',
    url: 'humanities',
    description: 'Geek of Humanities',
    type: 'default',
    creator: 1
  },
  GIT: {
    name: 'IT',
    url: 'it',
    description: 'Geek of information technology',
    type: 'default',
    creator: 1
  },
  GJ: {
    name: '법학',
    url: 'law',
    description: 'Geek of Jurisprudence',
    type: 'default',
    creator: 1
  },
  GM: {
    name: '수학',
    url: 'math',
    description: 'Geek of Math',
    type: 'default',
    creator: 1
  },
  GMD: {
    name: '의학',
    url: 'medicine',
    description: 'Geek of Medicine',
    type: 'default',
    creator: 1
  },
  GMU: {
    name: '음악',
    url: 'music',
    description: 'Geek of music',
    type: 'default',
    creator: 1
  },
  GP: {
    name: '철학',
    url: 'philosophy',
    description: 'Geek of Philosophy',
    type: 'default',
    creator: 1
  },
  GS: {
    name: '과학',
    url: 'science',
    description: 'Geek of Science (Physics, Chemistry, Biology, etc.)',
    type: 'default',
    creator: 1
  },
  GSS: {
    name: '사회과학',
    url: 'socialscience',
    description: 'Geek of Social Science (Psychology, Sociology, etc.)',
    type: 'default',
    creator: 1
  },
  GTW: {
    name: '테크니컬라이팅',
    url: 'technicalwriting',
    description: 'Geek of Technical Writing',
    type: 'default',
    creator: 1
  },
  GAT: {
    name: '거래',
    url: 'trade',
    description: 'Geek of All Trades',
    type: 'default',
    creator: 1
  }
};
/**
 * Faker test2 method
 * @method
 * @public
 * @param {Object} app Express app instance
 * @return {void}
 */
Faker.prototype.test2 = function (app) {
  model
    .user
    .create({
      email: 'webmaster@gobblinclub.com',
      nick: '고블린클럽',
      password: 'gobblinclub12'
    })
    .then(function (user) {
      _.forEach(Geek, function (val, key) {
        if (key !== 'GAT') {
          model
            .club
            .create(val)
            .then(function (club) {
              club.setCreatedBy(user);
            });
        } else {
          return model
            .club
            .create(val)
            .then(function (club) {
              club.setCreatedBy(user);
            });
        }
      });
    })
    .then(function () {
      app.listen(3001, function () {
        console.log('Goblin Api listening-dev');
      });
    });
};

module.exports = new Faker();
