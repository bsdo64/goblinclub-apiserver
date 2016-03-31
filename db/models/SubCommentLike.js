/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var SubCommentLike = sequelize.define('SubCommentLike', {
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    sub_comment_id: {
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
        models.SubComment.belongsToMany(models.User, {
          through: {
            model: SubCommentLike,
            unique: false,
            constraints: false
          },
          unique: false,
          as: 'userLikeSubComment',
          foreignKey: 'sub_comment_id',
          constraints: false
        });

        models.User.belongsToMany(models.SubComment, {
          through: {
            model: SubCommentLike,
            unique: false,
            constraints: false
          },
          unique: false,
          as: 'likeSubComment',
          foreignKey: 'user_id'
        });
        
        
      }
    },
    underscored: true
  });
  return SubCommentLike;
};
