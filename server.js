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
  var tUser, tClub1, tClub2;
  model.sequelize.sync({force: true})
    .then(function () {
      return new Promise(function (resolve, reject) {
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
                tClub2.setUsers(tUser);

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
                post.setClubs(tClub1);

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
                post.setClubs(tClub2);

                return true;
              })
              .then(function () {
                console.log('test x ' + value);
                return value + 1;
              })
              .then(loop);
          } else if (value === 10) {
            console.log('DB inital-Dev');
            app.listen(3001, function () {
              console.log('Goblin Api listening-Dev. Val : ', value);
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
