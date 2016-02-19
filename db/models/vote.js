/**
 * Created by dobyeongsu on 2015. 10. 28..
 */

module.exports = function (sequelize, DataTypes) {
  var Vote = sequelize.define('vote', {
    votable: {
      comment: '투표한 게시물 종류 "post", "comment"',
      type: DataTypes.STRING,
      allowNull: false
    },
    votableId: {
      comment: '투표한 게시물 아이디',
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    liker: {
      comment: '회원 아이디',
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kind: {
      comment: '1 == 좋아요, 0 == 싫어요',
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function (models) {
        Vote.belongsTo(models.user, {
          foreignKey: {
            name: 'liker',
            allowNull: false
          }
        });
      }
    }
  });

  return Vote;
};
