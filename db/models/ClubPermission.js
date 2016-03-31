/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ClubPermission = sequelize.define('ClubPermission', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    
    club_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: function (models) {
        ClubPermission.belongsTo(models.Club, {
          foreignKey: 'club_id',
          constraints: false
        });

        ClubPermission.hasMany(models.MembershipPermission);
        ClubPermission.hasMany(models.GradePermission);
        ClubPermission.hasMany(models.ProfilePermission);
      }
    },
    underscored: true
  });
  return ClubPermission;
};
