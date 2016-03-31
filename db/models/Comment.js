/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
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
    
    post_id: {
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
        Comment.belongsTo(models.User);
        Comment.belongsTo(models.Post);
        
        Comment.hasMany(models.SubComment);
        Comment.hasMany(models.CommentLikeLog);
      }
    },
    underscored: true
  });
  return Comment;
};
