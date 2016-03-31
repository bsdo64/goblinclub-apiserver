/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var PointAction = sequelize.define('PointAction', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    point_value: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    action_value: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        PointAction.belongsTo(models.Action);
      }
    },
    underscored: true
  });
  return PointAction;
};
