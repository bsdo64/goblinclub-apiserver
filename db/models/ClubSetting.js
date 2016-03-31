/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ClubSetting = sequelize.define('ClubSetting', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    using: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '1'
    },
    rules: {
      type: DataTypes.STRING,
      allowNull: true
    },
    club_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        
        ClubSetting.belongsTo(models.Club);
        ClubSetting.belongsTo(models.ClubType);
      }
    },
    underscored: true

  });
  return ClubSetting;
};
