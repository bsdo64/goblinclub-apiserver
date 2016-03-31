/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var CommentLike = sequelize.define('CommentLike', {
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    comment_id: {
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
        // Like.belongsTo(models.User);

        // Like Comment
        models.Comment.belongsToMany(models.User, {
          through: {
            model: CommentLike,
            unique: false,
            constraints: false
          },
          unique: false,
          as: 'userLikeComment',
          foreignKey: 'comment_id',
          constraints: false
        });

        models.User.belongsToMany(models.Comment, {
          through: {
            model: CommentLike,
            unique: false,
            constraints: false
          },
          unique: false,
          as: 'likeComment',
          foreignKey: 'user_id'
        });
        
        
      }
    },
    underscored: true
  });
  return CommentLike;
};
