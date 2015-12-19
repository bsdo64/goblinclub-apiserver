/**
 * Created by dobyeongsu on 2015. 11. 11..
 */

module.exports = function (sequelize, DataTypes) {
  var PostContent = sequelize.define('postcontent', {
    filename: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.STRING
    },
    ext: {
      type: DataTypes.STRING
    },
    contentType: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.BIGINT
    },
    uploader: {
      type: DataTypes.INTEGER
    },
    postId: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function (models) {
        PostContent.belongsTo(models.user, {
          onDelete: 'CASCADE',
          foreignKey: 'uploader'
        });

        PostContent.belongsTo(models.post, {
          foreignKey: 'postId'
        });
      }
    }
  });

  return PostContent;
};
