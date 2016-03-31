/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var PageView = sequelize.define('PageView', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    page_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    view_counts: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        PageView.hasMany(models.PageViewLog);
      }
    },
    underscored: true
  });
  return PageView;
};
