/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Membership = sequelize.define('Membership', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        Membership.hasMany(models.MembershipPermission);
        Membership.hasMany(models.MembershipRequire);
      }
    },
    underscored: true
  });
  return Membership;
};
