/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var PostLike = sequelize.define('PostLike', {
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: null
    },
    // user_id: {
    //   type: DataTypes.INTEGER(11),
    //   allowNull: false,
    // }
  }, {
    classMethods: {
      associate: function (models) {
        models.User.belongsToMany(models.Post, {
          through: 'PostLike',
          as: 'PostsUserLike'
        });
        models.Post.belongsToMany(models.User, {
          through: 'PostLike',
          as: 'UsersLikePost'
        });
      }
    },
    underscored: true
  });
  return PostLike;
};
