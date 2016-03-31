/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserMembershipLog = sequelize.define('UserMembershipLog', {
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
    user_membership_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    membership_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserMembershipLog.belongsTo(models.User);
        UserMembershipLog.belongsTo(models.UserMembership);
        UserMembershipLog.belongsTo(models.Membership);
      }
    },
    underscored: true
  });
  return UserMembershipLog;
};
