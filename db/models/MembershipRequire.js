/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var MembershipRequire = sequelize.define('MembershipRequire', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        MembershipRequire.belongsTo(models.Membership);
        MembershipRequire.belongsTo(models.Action);
      }
    },
    underscored: true
  });
  return MembershipRequire;
};
