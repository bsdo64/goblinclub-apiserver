/**
 * Created by dobyeongsu on 2015. 10. 28..
 */
var fs = require('fs');
var path = require('path');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var config = require('./../config')[env];
var Sequelize = require('sequelize');
var DB = {};

require('sequelize-hierarchy')(Sequelize);
var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: true
});

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
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
