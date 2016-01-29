/**
 * Created by dobyeongsu on 2015. 10. 28..
 */
var Validation = require('../validation');

module.exports = function (sequelize, DataTypes) {
  var Auth = sequelize.define('auth', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emailVerify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerifyAt: {
      type: DataTypes.DATE
    },
    dropUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dropAt: {
      type: DataTypes.DATE
    },
    loginAt: {
      type: DataTypes.DATE
    },
    logoutAt: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function (models) {
        Auth.belongsTo(models.user);
      }
    }
  });

  return Auth;
};
