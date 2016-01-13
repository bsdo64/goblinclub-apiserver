/**
 * Created by dobyeongsu on 2016. 1. 12..
 */
var model = require('../db');
var faker = require('faker');
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
  USER_CREATE: 20
};

var Faker = function () {};
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
              }).then(function (comment) {
                return model.comment.create({
                  commentId: shortId.generate(),
                  postId: post.get('uid'),
                  content: faker.lorem.sentences(),
                  author: userId,
                  parentCommentId: comment.get('commentId')
                }).then(function () {
                  return post;
                });
              });
            }).then(function setBelongingClubPromise(post) {
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
              }).then(function (comment) {
                return model.comment.create({
                  commentId: shortId.generate(),
                  postId: post.get('uid'),
                  content: faker.lorem.sentences(),
                  author: userId,
                  parentCommentId: comment.get('commentId')
                }).then(function () {
                  return post;
                });
              });
            }).then(function setBelongingClubPromise(post) {
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

module.exports = new Faker();
