/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var SubComment = sequelize.define('SubComment', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sub_comment_like_count: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0
    },

    comment_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        SubComment.belongsTo(models.Comment);
        SubComment.belongsTo(models.User);

        SubComment.hasMany(models.SubCommentLikeLog);
      }
    },
    underscored: true
  });
  return SubComment;
};
