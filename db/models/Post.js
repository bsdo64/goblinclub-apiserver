/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    like_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    comment_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    view_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    has_img: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    has_video: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    
    club_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    prefix_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  }, {
    classMethods: {
      associate: function (models) {
        Post.belongsTo(models.Club);
        Post.belongsTo(models.User);
        Post.belongsTo(models.Prefix);

        Post.belongsToMany(models.Tag, {
          through: 'TagHasPost'
        });

        Post.hasMany(models.Comment);
        Post.hasMany(models.PostLikeLog);
      }
    },
    underscored: true
  });
  return Post;
};
