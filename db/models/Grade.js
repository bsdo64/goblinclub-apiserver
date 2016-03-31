/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Grade = sequelize.define('Grade', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
  }, {
    classMethods: {
      associate: function (models) {
        Grade.hasMany(models.GradeRequire);
        Grade.hasMany(models.GradePermission);
      }
    },
    underscored: true
  });
  return Grade;
};
