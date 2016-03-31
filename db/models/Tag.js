/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
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
        Tag.belongsToMany(models.Post, {
          through: 'TagHasPosts'
        });
      }
    },
    underscored: true
  });
  return Tag;
};
