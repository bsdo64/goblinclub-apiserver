/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ProfilePermission = sequelize.define('ProfilePermission', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    colum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        ProfilePermission.belongsTo(models.Permission);
        ProfilePermission.belongsTo(models.ClubPermission);
      }
    },
    underscored: true
  });
  return ProfilePermission;
};
