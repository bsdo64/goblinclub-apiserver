/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserPointLog = sequelize.define('UserPointLog', {
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
    user_point_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    point_action_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserPointLog.belongsTo(models.User);
        UserPointLog.belongsTo(models.UserPoint);
        UserPointLog.belongsTo(models.PointAction);
      }
    },
    underscored: true
  });
  return UserPointLog;
};
