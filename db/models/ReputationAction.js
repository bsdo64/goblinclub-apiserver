/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ReputationAction = sequelize.define('ReputationAction', {
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
    action_value: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    reputation_value: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
  }, {
    classMethods: {
      associate: function (models) {
        ReputationAction.belongsTo(models.Action);
      }
    },
    underscored: true
  });
  return ReputationAction;
};
