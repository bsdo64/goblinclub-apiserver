/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nick: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        User.hasOne(models.UserProfile);
        User.hasOne(models.UserGrade);
        User.hasOne(models.UserMembership);
        User.hasOne(models.UserActivity);
        User.hasOne(models.UserPoint);
        User.hasOne(models.UserReputation);

        User.hasMany(models.Post);
        User.hasMany(models.Club);
        User.hasMany(models.Comment);
        User.hasMany(models.SubComment);
        
        User.hasMany(models.PostLikeLog);
        User.hasMany(models.CommentLikeLog);
        User.hasMany(models.SubCommentLikeLog);

        User.hasMany(models.PageViewLog);
      }
    },
    underscored: true,
    paranoid: true
  });

  return User;
};
