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

        // PostLike
        models.Post.belongsToMany(models.User, {
          through: {
            model: PostLike,
            unique: false
          },
          unique: false,
          as: 'userLikePost',
          foreignKey: 'post_id',
          constraints: false
        });

        models.User.belongsToMany(models.Post, {
          through: {
            model: PostLike,
            unique: false
          },
          unique: false,
          as: 'likePost',
          foreignKey: 'user_id'
        });
        
      }
    },
    underscored: true
  });
  return PostLike;
};
