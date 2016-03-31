/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserGradeLog = sequelize.define('UserGradeLog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    user_grade_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    grade_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserGradeLog.belongsTo(models.User);
        UserGradeLog.belongsTo(models.UserGrade);
        UserGradeLog.belongsTo(models.Grade);
      }
    },
    underscored: true
  });
  return UserGradeLog;
};
