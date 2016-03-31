/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserActivity = sequelize.define('UserActivity', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    post_counts: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    comment_counts: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    like_counts: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    attendent_counts: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    sharing_counts: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    points: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    reputation_counts: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    tag_counts: {
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
        UserActivity.belongsTo(models.User);
      }
    },
    underscored: true
  });
  return UserActivity;
};
