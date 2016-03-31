/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ReputationLog = sequelize.define('ReputationLog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    receiver_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    sender_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    user_reputation_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    reputation_action_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        ReputationLog.belongsTo(models.User, {
          foreignKey: 'sender_id'
        });
        ReputationLog.belongsTo(models.User, {
          foreignKey: 'receiver_id'
        });
        ReputationLog.belongsTo(models.UserReputation);
        ReputationLog.belongsTo(models.ReputationAction);
      }
    },
    underscored: true
  });
  return ReputationLog;
};
