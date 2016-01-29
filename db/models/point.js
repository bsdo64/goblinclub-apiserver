/**
 * Created by dobyeongsu on 2015. 10. 28..
 */
var Validation = require('../validation');

module.exports = function (sequelize, DataTypes) {
  var Point = sequelize.define('point', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    point: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function (models) {
        Point.belongsTo(models.user);

        Point.hasMany(models.point_log, {
          foreignKey: {
            name: 'pointId',
            allowNull: false
          },
          as: 'pointLog',
        });
      }
    }
  });

  return Point;
};
