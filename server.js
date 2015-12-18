/**
 * Created by dobyeongsu on 2015. 10. 18..
 */
var Express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var composeServer = require('./Router/ServerSide');
var composeClient = require('./Router/ClientSide');

var app = Express();
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

app.listen(3001, function () {
  var model = require('./db');
  model.sequelize.sync().then(function () {
    console.log('Goblin Api listening');
  });
});