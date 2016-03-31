/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Action = sequelize.define('Action', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        // Action.hasOne(models.MembershipRequire);
        // Action.hasOne(models.GradeRequire);
        // Action.hasOne(models.PointAction);
        // Action.hasOne(models.ReputationAction);
      }
    },
    underscored: true
  });
  return Action;
};
