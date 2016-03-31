/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Club = sequelize.define('Club', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    club_group_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        Club.hasOne(models.ClubSetting);
        Club.hasOne(models.ClubPermission, {
          foreignKey: 'club_id',
          constraints: false
        });

        Club.hasMany(models.Prefix);
        Club.hasMany(models.Post);
        
        Club.belongsTo(models.ClubGroup);
        Club.belongsTo(models.User);
      }
    },
    underscored: true
  });
  return Club;
};
