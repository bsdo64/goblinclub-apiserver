/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var UserMembership = sequelize.define('UserMembership', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    membership_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserMembership.belongsTo(models.User);
        UserMembership.belongsTo(models.Membership);
      }
    },
    underscored: true
  });
  return UserMembership;
};
