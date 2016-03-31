/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var CommentLikeLog = sequelize.define('CommentLikeLog', {
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
        CommentLikeLog.belongsTo(models.User);
        CommentLikeLog.belongsTo(models.Comment);
        
      }
    },
    underscored: true
  });
  return CommentLikeLog;
};
