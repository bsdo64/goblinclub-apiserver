/**
 * Created by dobyeongsu on 2015. 10. 28..
 */

module.exports = function (sequelize, DataTypes) {
  var UserRead = sequelize.define('user_read', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    },
    postId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        UserRead.belongsTo(models.user, {
          onDelete: 'CASCADE',
          foreignKey: 'userId',
          allowNull: false
        });
        UserRead.belongsTo(models.post, {
          onDelete: 'CASCADE',
          foreignKey: 'postId',
          allowNull: false
        });
      }
    }
  });

  return UserRead;
};
