/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserProfile = sequelize.define('UserProfile', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    birth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sex: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar_img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: true
    },

    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserProfile.belongsTo(models.User);
      }
    },
    underscored: true
  });
  return UserProfile;
};
