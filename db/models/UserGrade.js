/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserGrade = sequelize.define('UserGrade', {
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
    grade_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserGrade.belongsTo(models.Grade);
        UserGrade.belongsTo(models.User);
      }
    },
    underscored: true
  });
  return UserGrade;
};
