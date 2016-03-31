/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var GradePermission = sequelize.define('GradePermission', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    permission_value: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    classMethods: {
      associate: function (models) {
        GradePermission.belongsTo(models.Grade);
        GradePermission.belongsTo(models.Permission);
        GradePermission.belongsTo(models.ClubPermission);
      }
    },
    underscored: true
  });
  return GradePermission;
};
