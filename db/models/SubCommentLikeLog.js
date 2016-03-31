/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var SubCommentLikeLog = sequelize.define('SubCommentLikeLog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sub_comment_id: {
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
        SubCommentLikeLog.belongsTo(models.User);
        SubCommentLikeLog.belongsTo(models.SubComment);
        
      }
    },
    underscored: true
  });
  return SubCommentLikeLog;
};
