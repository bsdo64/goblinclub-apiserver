/**
 * Created by dobyeongsu on 2015. 10. 18..
 */
var Express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');

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

app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
});

app.use('/compose', composeServer);
app.use('/ajax', composeClient);

app.use(function (req, res) {
  // console.log(req.url, 'There\'s no endpoint!');
  res.status(404).json({
    msg: 'There\'s no endpoint!'
  });
});

var Seed = require('./Seed');
var model = require('./db/models/index');
if (process.env.NODE_ENV === 'development') {
    model.sequelize.sync({force: true})
        .then(function () {
            Seed.init(app, function () {
                app.listen(3001, function () {
                    console.log('DB inital-DEV : Seeded!');
                });
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
