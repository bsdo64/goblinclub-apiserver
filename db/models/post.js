/**
 * Created by dobyeongsu on 2015. 11. 11..
 */
module.exports = function (sequelize, DataTypes) {
  var Post = sequelize.define('post', {
    uid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.TEXT
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        Post.belongsTo(models.user, {
          onDelete: 'CASCADE',
          foreignKey: 'author',
          allowNull: false
        });

        Post.belongsToMany(models.club, {
          through: {
            model: models.club_post,
            unique: false
          },
          foreignKey: 'postId'
        });

        Post.hasMany(models.comment, {
          foreignKey: 'postId',
          onDelete: 'CASCADE'
        });

        Post.hasMany(models.postcontent, {
          foreignKey: 'postId',
          onDelete: 'CASCADE'
        });
      }
    }
  });

  return Post;
};