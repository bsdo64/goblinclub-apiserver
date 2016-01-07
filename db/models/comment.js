/**
 * Created by dobyeongsu on 2015. 10. 28..
 */
var Validation = require('../validation');

module.exports = function (sequelize, DataTypes) {
  var Comment = sequelize.define('comment', {
    commentId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    postId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
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
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    classMethods: {
      associate: function (models) {
        Comment.belongsTo(models.user, {
          foreignKey: {
            name: 'author',
            allowNull: false
          }
        });

        Comment.belongsTo(models.post, {
          foreignKey: 'postId'
        });

        Comment.hasOne(models.commentcontent, {
          foreignKey: {
            name: 'commentId',
            onDelete: 'CASCADE'
          }
        });
      }
    },

    hierarchy: true
  });

  return Comment;
};
