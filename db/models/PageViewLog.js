/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var PageViewLog = sequelize.define('PageViewLog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    page_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    page_view_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {
        PageViewLog.belongsTo(models.User);
        PageViewLog.belongsTo(models.PageView);
      }
    },
    underscored: true
  });
  return PageViewLog;
};
