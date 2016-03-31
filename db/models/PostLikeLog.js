/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var PostLikeLog = sequelize.define('PostLikeLog', {
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
        PostLikeLog.belongsTo(models.User);
        PostLikeLog.belongsTo(models.Post);
        
      }
    },
    underscored: true
  });
  return PostLikeLog;
};
