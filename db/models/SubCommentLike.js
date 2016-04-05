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

        models.User.belongsToMany(models.SubComment, {
          through: 'SubCommentLike',
          as: 'SubCommentsUserLike'
        });
        models.SubComment.belongsToMany(models.User, {
          through: 'SubCommentLike',
          as: 'UsersLikeSubComment'
        });
      }
    },
    underscored: true
  });
  return SubCommentLike;
};
