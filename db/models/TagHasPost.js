/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var TagHasPost = sequelize.define('TagHasPost', {
    tag_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  }, {
    classMethods: {
      associate: function (models) {

      }
    },
    underscored: true
  });
  return TagHasPost;
};
