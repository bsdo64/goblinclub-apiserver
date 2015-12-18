/**
 * Created by dobyeongsu on 2015. 10. 28..
 */

var Validation = require('../validation');

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('user', {
    email: {
      comment: '회원의 이름 필드',
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: Validation.User.email
    },
    nick: {
      comment: '회원의 닉 필드',
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: Validation.User.nick
    },
    password: {
      comment: '회원의 비밀번호 필드',
      type: DataTypes.STRING,
      allowNull: false,
      validate: Validation.User.password
    }
  }, {
    classMethods: {
      associate: function (models) {
        User.hasOne(models.auth);

        User.hasMany(models.post, {
          foreignKey: {
            name: 'author',
            allowNull: false
          }
        });

        User.hasMany(models.club, {
          foreignKey: {
            name: 'creator',
            allowNull: false
          }
        });

        User.hasMany(models.comment, {
          foreignKey: {
            name: 'author',
            allowNull: false
          }
        });

        User.hasMany(models.vote, {
          foreignKey: {
            name: 'liker',
            allowNull: false
          }
        });

        User.belongsToMany(models.club, {
          through: {
            model: models.club_user,
            unique: false
          },
          as: 'userCreatedClubs',
          foreignKey: 'userId'
        });

        User.belongsToMany(models.club, {
          through: {
            model: models.subscribe,
            unique: false
          },
          as: 'userSubscribedClubs',
          foreignKey: 'userId'
        });
      }
    }
  });

  return User;
};
