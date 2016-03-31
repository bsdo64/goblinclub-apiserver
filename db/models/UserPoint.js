/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserPoint = sequelize.define('UserPoint', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserPoint.belongsTo(models.User);
      }
    },
    underscored: true
  });
  return UserPoint;
};
