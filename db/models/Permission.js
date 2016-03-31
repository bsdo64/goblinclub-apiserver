/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        Permission.hasMany(models.MembershipPermission);
        Permission.hasMany(models.GradePermission);
        Permission.hasMany(models.ProfilePermission);
      }
    },
    underscored: true
  });
  return Permission;
};
