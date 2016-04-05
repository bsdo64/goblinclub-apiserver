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

        models.User.belongsToMany(models.Comment, {
          through: 'CommentLike',
          as: 'CommentsUserLike'
        });
        models.Comment.belongsToMany(models.User, {
          through: 'CommentLike',
          as: 'UsersLikeComment'
        });
        
      }
    },
    underscored: true
  });
  return CommentLike;
};
