/**
 * Created by dobyeongsu on 2015. 10. 28..
 */
var Validation = require('../validation');

module.exports = function (sequelize, DataTypes) {
  var Club = sequelize.define('club', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        Club.belongsTo(models.user, {
          foreignKey: {
            onDelete: 'CASCADE',
            name: 'creator',
            allowNull: false
          }
        });

        Club.belongsToMany(models.post, {
          through: {
            model: models.club_post,
            unique: false
          },
          as: 'clubHas',
          foreignKey: 'clubId'
        });

        Club.belongsToMany(models.user, {
          through: {
            model: models.club_user,
            unique: false
          },
          as: 'createdBy',
          constraints: false,
          foreignKey: 'clubId'
        });

        Club.belongsToMany(models.user, {
          through: {
            model: models.subscribe,
            unique: false
          },
          as: 'subscribedBy',
          constraints: false,
          foreignKey: 'clubId'
        });
      }
    }
  });

  return Club;
};
