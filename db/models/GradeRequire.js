/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var GradeRequire = sequelize.define('GradeRequire', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    count_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    minValue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    maxValue: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        GradeRequire.belongsTo(models.Grade);
        GradeRequire.belongsTo(models.Action);
      }
    },
    underscored: true
  });
  return GradeRequire;
};
