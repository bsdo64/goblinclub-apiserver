/**
 * Created by dobyeongsu on 2015. 10. 18..
 */
var Express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');

var AuthUser = require('./Router/AuthUser');
var composeServer = require('./Router/ServerSide');
var composeClient = require('./Router/ClientSide');

var app = Express();

const origin = 'http://localhost:3000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.locals.settings['x-powered-by'] = false;
app.use(cors({origin: origin}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function log(req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(req.method, req.url, req.headers, ip);
  next();
});

app.use(AuthUser);
app.use('/compose', composeServer);
app.use('/ajax', composeClient);

app.use(function (req, res) {
  res.status(404).json({
    msg: 'There\'s no endpoint!'
  });
});

app.use(function errorHandler(err, req, res, next) {

  function sendWithMessage(code, message) {
    console.error(err.stack);
    res.status(code || 500).send(message || 'default Error Message');
  }

  switch (err.name) {
    case 'JsonWebTokenError':
      sendWithMessage(403, '잘못된 사용자 입니다');
      break;

    case 'TokenExpiredError':
      sendWithMessage(403, '잘못된 토큰 입니다');
      break;

    case 'CheckUserAuthError':
      sendWithMessage(403, '잘못된 사용자 입니다');
      break;

    default:
      sendWithMessage(500, '서버 에러');
  }
});

var Seed = require('./Seed');
var model = require('./db/models/index');
if (process.env.NODE_ENV === 'development') {
    model.sequelize.sync({force: false})
        .then(function () {
            Seed.init(app, function () {
              Seed.addPosts(20, function() {
                app.listen(3001, function () {
                  console.log('DB inital-DEV : Seeded!');
                });
              });

              // app.listen(3001, function () {
              //   console.log('DB inital-DEV : Seeded!');
              // });
            });
        });
} else if (process.env.NODE_ENV === 'production') {
  model.sequelize.sync({force: true})
    .then(function () {
      app.listen(3001, function () {
        console.log('DB inital-Production');
      });

      // Seed.test2(app, function () {
      //   app.listen(3001, function () {
      //     console.log('DB inital-PRODCTION');
      //   });
      // });
    });
}
module.exports = app;
