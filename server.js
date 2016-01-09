/**
 * Created by dobyeongsu on 2015. 10. 18..
 */
var Express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Promise = require('bluebird');

var composeServer = require('./Router/ServerSide');
var composeClient = require('./Router/ClientSide');

var app = Express();
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === 'production' )? 'production' : 'development';

app.locals.settings['x-powered-by'] = false;
app.use(cors({origin: 'http://localhost:3000'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
});

app.use('/compose', composeServer);
app.use('/ajax', composeClient);

app.use(function (req, res) {
  console.log(req.url, 'There\'s no endpoint!');
  res.status(404).json({
    msg: 'There\'s no endpoint!'
  });
});

var model = require('./db');
if (process.env.NODE_ENV === 'development') {
  model.sequelize.sync({force: true})
    .then(function () {
      return new Promise(function (resolve, reject) {
        var tUser, tClub1, tClub2, tPost1, tPost2;
        (function loop(value) {
          if (value !== 10) {
            model
              .user
              .create({
                email: 'tests' + value + '@test.com',
                nick: 'tests' + value,
                password: 'teset1234'
              })
              .then(function (user) {
                tUser = user;

                return model
                  .club
                  .create({
                    name: '테스트' + value,
                    url: 'test' + value,
                    description: '테스트입니다',
                    type: 'default',
                    creator: tUser.get({plain: true}).id
                  });
              })
              .then(function (club) {
                tClub1 = club;
                tClub1.setCreatedBy(tUser);

                return model
                  .club
                  .create({
                    name: '게임' + value,
                    url: 'game' + value,
                    description: '게임입니다',
                    type: 'create',
                    creator: tUser.get({plain: true}).id
                  });
              })
              .then(function (club) {
                tClub2 = club;
                tClub2.setSubscribedBy(tUser);

                return tClub2.setCreatedBy(tUser);
              })
              .then(function () {
                return model
                  .post
                  .create({
                    uid: '1q' + value,
                    title: 'Hello world',
                    content: '<p class=""><br></p><p class="">내용</p><div class="medium-insert-embeds"> <figure> <div class="medium-insert-embed"> <div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;"><iframe src="https://www.youtube.com/embed/ycSOnGzbNO4?wmode=transparent&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;enablejsapi=1" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;"></iframe></div> </div> </figure> </div><p><br></p>',
                    author: tUser.get({plain: true}).id
                  });
              })
              .then(function (post) {
                tPost1 = post;

                return model.comment.create({
                  commentId: '1q' + value + '1q',
                  postId: post.get('uid'),
                  content: 'Hello world!!!' + value,
                  author: tUser.get('id')
                });
              })
              .then(function (comment) {
                return model.comment.create({
                  commentId: '1q' + value + '1q1w',
                  postId: tPost1.get('uid'),
                  content: '2Hello world!!!' + value,
                  author: tUser.get('id'),
                  parentCommentId: comment.get('commentId')
                });
              }).then(function (comment) {
                  return tPost1.setBelongingClubs(tClub1);
              })
              .then(function () {
                return model
                  .post
                  .create({
                    uid: '1q2w' + value,
                    title: 'Hello world',
                    content: '<p class=""><br></p><p class="">내용</p><div class="medium-insert-embeds"> <figure> <div class="medium-insert-embed"> <div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.2493%;"><iframe src="https://www.youtube.com/embed/ycSOnGzbNO4?wmode=transparent&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;enablejsapi=1" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;"></iframe></div> </div> </figure> </div><p><br></p>',
                    author: tUser.get({plain: true}).id
                  });
              })
              .then(function (post) {
                tPost2 = post;

                return model.comment.create({
                  commentId: '1q' + value + '1q1w' + value,
                  postId: post.get('uid'),
                  content: '2Hello world!!!' + value,
                  author: tUser.get('id')
                });
              })
              .then(function (comment) {
                return model.comment.create({
                  commentId: '1q' + value + '1q1' + value,
                  postId: tPost2.get('uid'),
                  content: 'Hello world!!!' + value,
                  author: tUser.get('id'),
                  parentCommentId: comment.get('commentId')
                });
              })
              .then(function (comment) {
                return tPost2.setBelongingClubs(tClub2);
              })
              .then(function () {
                return model.vote.findOrCreate({
                  where: {
                    votable: 'post',
                    votableId: tPost1.get({plain: true}).uid,
                    liker: tUser.get({plain: true}).id,
                    kind: 1
                  }
                });
              })
              .spread(function (vote, created) {
                return tPost1.increment({voteCount: 1, likeCount: 1});
              })
              .then(function () {
                return value + 1;
              })
              .then(loop);
          } else if (value === 10) {
            console.log('DB init - test case : ', value);
            app.listen(3001, function () {
              console.log('Goblin Api listening-dev');
            });
          }
          return Promise.resolve(value);
        })(0);

      });
    });
} else if (process.env.NODE_ENV === 'production') {
  model.sequelize.sync({force: false})
    .then(function () {
      console.log('DB inital-Prod');
    })
    .then(function () {
      app.listen(3001, function () {
        console.log('Goblin Api listening-Prod');
      });
    });
}
module.exports = app;
