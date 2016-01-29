/**
 * Created by dobyeongsu on 2015. 10. 28..
 */
var Validation = require('../validation');

module.exports = function (sequelize, DataTypes) {
  var PointLog = sequelize.define('point_log', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    value: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    pointId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        PointLog.belongsTo(models.point, {
          foreignKey: {
            onDelete: 'CASCADE',
            name: 'pointId',
            allowNull: false,
            constraints: false
          }
        });
      }
    }
  });

  return PointLog;
};
