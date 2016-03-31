/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var MembershipPermission = sequelize.define('MembershipPermission', {
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
        MembershipPermission.belongsTo(models.Membership);
        MembershipPermission.belongsTo(models.Permission);
        MembershipPermission.belongsTo(models.ClubPermission);
      }
    },
    underscored: true
  });
  return MembershipPermission;
};
