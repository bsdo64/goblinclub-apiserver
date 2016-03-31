/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserProfileLog = sequelize.define('UserProfileLog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    colum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_profile_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserProfileLog.belongsTo(models.User);
        UserProfileLog.belongsTo(models.UserProfile);
      }
    },
    underscored: true
  });
  return UserProfileLog;
};
