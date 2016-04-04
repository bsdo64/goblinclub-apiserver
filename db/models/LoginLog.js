/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var LoginLog = sequelize.define('LoginLog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    referrer_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  }, {
    classMethods: {
      associate: function (models) {
        LoginLog.belongsTo(models.User);
      }
    },
    underscored: true
  });
  return LoginLog;
};
