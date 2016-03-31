/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ClubType = sequelize.define('ClubType', {
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

      }
    },
    underscored: true
  });
  return ClubType;
};
