/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ClubGroup = sequelize.define('ClubGroup', {
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
    order: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    using: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '1'
    },
    
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
  }, {
    classMethods: {
      associate: function (models) {
        ClubGroup.belongsTo(models.User);
        
        ClubGroup.hasMany(models.Club);
      }
    },
    underscored: true
  });

  return ClubGroup;
};
