/**
 * Created by dobyeongsu on 2015. 10. 28..
 */
var fs = require('fs');
var path = require('path');
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
var Sequelize = require('sequelize');
var DB = {};

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

fs
  .readdirSync((__dirname + '/models'))
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
