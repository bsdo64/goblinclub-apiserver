/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Prefix = sequelize.define('Prefix', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    club_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        Prefix.belongsTo(models.Club);
        Prefix.hasMany(models.Post);
      }
    },
    underscored: true
  });
  return Prefix;
};
