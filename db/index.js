/**
 * Created by dobyeongsu on 2015. 10. 28..
 */
var fs = require('fs');
var path = require('path');
var config = require('./config').DB;
var Sequelize = require('sequelize');
require('sequelize-hierarchy')(Sequelize);

var sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: false
});
var DB = {};

fs
  .readdirSync((__dirname + '/models'))
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, '/models', file));
    DB[model.name] = model;
  });

Object.keys(DB).forEach(function (modelName) {
  if ('associate' in DB[modelName]) {
    DB[modelName].associate(DB);
  }
});

DB.sequelize = sequelize;
DB.Sequelize = Sequelize;

module.exports = DB;
