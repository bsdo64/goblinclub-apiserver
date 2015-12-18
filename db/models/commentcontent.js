/**
 * Created by dobyeongsu on 2015. 10. 28..
 */
var Validation = require('../validation');

module.exports = function (sequelize, DataTypes) {
  var Commentcontent = sequelize.define('commentcontent', {
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
    commentId: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function (models) {
        Commentcontent.belongsTo(models.user, {
          onDelete: 'CASCADE',
          foreignKey: 'uploader'
        });

        Commentcontent.belongsTo(models.comment, {
          foreignKey: 'commentId'
        });
      }
    }
  });

  return Commentcontent;
};
