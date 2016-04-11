/**
 * Created by dobyeongsu on 2016. 1. 12..
 */
/** @module Faker */

var model = require('../db/models/index');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');

/**
 * Faker Constructor
 * @class
 * @constructor
 */
var Seed = function () {};

/**
 * Faker test2 method
 * @method
 * @public
 * @param {Object} app Express app instance
 * @return {Promise}
 */
Seed.prototype.init = function (app, cb) {
  var seed = {};
  var userId;

  model
    .User
    .create({email: 'bsdo@naver.com', nick: '고블린클럽', password: bcrypt.hashSync('goblinclub', 10)})

    // User Profile
    .then(function(user) {
      seed.user = user;
      userId = seed.user.get('id');

      return model
        .UserProfile
        .create({
          birth: new Date(), sex: 1, description: '안녕',
          joined_at: new Date(), user_id: userId
        });
    })

    // User Activity
    .then(function(result) {
      return model
        .UserActivity
        .create({user_id: userId});
    })

    // Action
    .then(function(result) {
      return model
        .Action
        .bulkCreate([
          // own
          { name: 'writePost', type: 'count'},
          { name: 'writeComment', type: 'count'},
          { name: 'writeClub', type: 'count'},
          { name: 'giveLike', type: 'count'},
          { name: 'attendance', type: 'count'},
          { name: 'writeTag', type: 'count'},
          { name: 'share', type: 'count'},

          { name: 'point', type: 'count'},
          { name: 'reputation', type: 'count'},

          { name: 'sex', type: 'bool'},

          // communicate
          { name: 'getComment', type: 'count' },
          { name: 'getLike', type: 'count' },
          { name: 'getViews', type: 'count' },

          // membership
          { name: 'guest', type: 'bool' },
          { name: 'signin', type: 'bool' },
          { name: 'paied', type: 'bool' },
        ]);
    })
    .then(function() {
      return model.Action.findAll();
    })

    // Membership
    .then(function(actions) {
      seed.actions = actions;
      return model
        .Membership
        .bulkCreate([
          { name: '손님'},
          { name: '일반 회원'},
          { name: '정기 회원'},
          { name: '스텝'},
          { name: '관리자'}
        ]);
    })
    .then(function() {
      return model.Membership.findAll();
    })

    // Membership Require
    .then(function(memberships) {
      seed.memberships = memberships;
        
      return model
        .MembershipRequire
        .bulkCreate([
          { membership_id: seed.memberships[0].get('id'), action_id: seed.actions[0].get('id'), value: 10 },
          { membership_id: seed.memberships[0].get('id'), action_id: seed.actions[1].get('id'), value: 10 },
          { membership_id: seed.memberships[0].get('id'), action_id: seed.actions[2].get('id'), value: 10 },
          { membership_id: seed.memberships[1].get('id'), action_id: seed.actions[0].get('id'), value: 20 },
          { membership_id: seed.memberships[1].get('id'), action_id: seed.actions[1].get('id'), value: 20 },
          { membership_id: seed.memberships[1].get('id'), action_id: seed.actions[2].get('id'), value: 20 },
          { membership_id: seed.memberships[2].get('id'), action_id: seed.actions[0].get('id'), value: 50 },
          { membership_id: seed.memberships[2].get('id'), action_id: seed.actions[1].get('id'), value: 50 },
          { membership_id: seed.memberships[2].get('id'), action_id: seed.actions[2].get('id'), value: 50 },
          { membership_id: seed.memberships[3].get('id'), action_id: seed.actions[0].get('id'), value: 70 },
          { membership_id: seed.memberships[3].get('id'), action_id: seed.actions[1].get('id'), value: 70 },
          { membership_id: seed.memberships[3].get('id'), action_id: seed.actions[2].get('id'), value: 70 },
          { membership_id: seed.memberships[4].get('id'), action_id: seed.actions[0].get('id'), value: 70 },
          { membership_id: seed.memberships[4].get('id'), action_id: seed.actions[1].get('id'), value: 70 },
          { membership_id: seed.memberships[4].get('id'), action_id: seed.actions[2].get('id'), value: 70 },
        ]);
    })

    // User Membership
    .then(function() {
      return model
        .UserMembership
        .create({user_id: userId, membership_id: seed.memberships[4].get('id')});
    })

    // Grade
    .then(function(result) {
      return model
        .Grade
        .bulkCreate([
          { name: '브론즈' },
          { name: '실버' },
          { name: '골드' },
          { name: '다이아몬드' },
          { name: '마스터' }
        ]);
    })
    .then(function() {
      return model.Grade.findAll();
    })

    // Grade Require
    .then(function(grades) {
      seed.grades = grades;

      var bulks = [];
      for (var gKey in seed.grades) {
        for (var aKey = 0; aKey < 3; aKey++) {
          bulks.push({
            grade_id: seed.grades[gKey].get('id'),
            action_id: seed.actions[aKey].get('id'),
            minValue: gKey * 10,
            maxValue: (gKey * 10 + 1) + 10
          });
        }
      }
      console.log(bulks);
      return model
        .GradeRequire
        .bulkCreate(bulks);
    })

    // User Grade
    .then(function() {
      return model
        .UserGrade
        .create({user_id: userId, grade_id: seed.grades[0].get('id')});
    })

    // User Point
    .then(function() {
      return model
        .UserPoint
        .create({user_id: userId});
    })

    // PointAction
    .then(function() {
      return model
        .PointAction
        .bulkCreate([
          { action_id: seed.actions[0].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[1].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[2].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[3].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[4].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[5].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[6].get('id'), action_value: 1, point_value: 1 },
        ]);
    })

    // User Reputation
    .then(function() {
      return model
        .UserReputation
        .create({user_id: userId});
    })

    // Reputation Action
    .then(function() {
      return model
        .ReputationAction
        .bulkCreate([
          { action_id: seed.actions[10].get('id'), action_value: 1, reputation_value: 1 },
          { action_id: seed.actions[11].get('id'), action_value: 1, reputation_value: 1 },
          { action_id: seed.actions[12].get('id'), action_value: 1, reputation_value: 2 },
        ]);
    })

    // Club Group
    .then(function() {
      return model
        .ClubGroup
        .bulkCreate([
          { title: '공지', description: '공지게시판 입니다', order: 0, using: 1, user_id: userId },
          { title: '회원 멤버', description: '회원 멤버 게시판 입니다', order: 1, using: 1, user_id: userId },
          { title: '고민 나눔', description: '고민 상담 게시판 입니다', order: 2, using: 1, user_id: userId },
          { title: '탈모자료실', description: '탈모 자료실 입니다', order: 3, using: 1, user_id: userId },
          { title: '치료 후기', description: '치료 후기 게시판 입니다', order: 4, using: 1, user_id: userId },
          { title: '놀이터', description: '회원 놀이터 입니다', order: 5, using: 1, user_id: userId },
        ]);
    })
    .then(function() {
      return model.ClubGroup.findAll();
    })

    // Club
    .then(function(clubgroups) {
      seed.clubgroups = clubgroups;

      return model
        .Club
        .bulkCreate([
          { title: '공지사항', description: '공지게시판 입니다', order: 0, url: 'notice', user_id: userId, club_group_id: clubgroups[0].get('id') },
          { title: '이벤트', description: '고민 상담 게시판 입니다', order: 1, url: 'event', user_id: userId, club_group_id: clubgroups[0].get('id')  },

          { title: '인사 나누기', description: '탈모 자료실 입니다', order: 0, url: 'hello', user_id: userId, club_group_id: clubgroups[1].get('id')  },
          { title: '출석체크', description: '치료 후기 게시판 입니다', order: 1, url: 'attendance', user_id: userId, club_group_id: clubgroups[1].get('id')  },

          { title: '탈모 대백과', description: '치료 후기 게시판 입니다', order: 0, url: 'wiki', user_id: userId, club_group_id: clubgroups[3].get('id')  },
          { title: '탈모 뉴스(의학)', description: '치료 후기 게시판 입니다', order: 1, url: 'news', user_id: userId, club_group_id: clubgroups[3].get('id')  },
          { title: '탈모 치료법 공유', description: '치료 후기 게시판 입니다', order: 2, url: 'share', user_id: userId, club_group_id: clubgroups[3].get('id')  },

          { title: '탈모 고민 & 확인', description: '치료 후기 게시판 입니다', order: 0, url: 'ami', user_id: userId, club_group_id: clubgroups[2].get('id')  },
          { title: '여성 전용', description: '치료 후기 게시판 입니다', order: 1, url: 'woman', user_id: userId, club_group_id: clubgroups[2].get('id')  },

          { title: '모발 이식 후기', description: '회원 놀이터 입니다', order: 0, url: 'after1', user_id: userId, club_group_id: clubgroups[4].get('id')  },
          { title: '탈모 치료제 후기', description: '회원 놀이터 입니다', order: 1, url: 'after2', user_id: userId, club_group_id: clubgroups[4].get('id')  },
          { title: '탈모 병원 후기', description: '회원 놀이터 입니다', order: 2, url: 'after3', user_id: userId, club_group_id: clubgroups[4].get('id')  },
          { title: '탈모 한의원 후기', description: '회원 놀이터 입니다', order: 3, url: 'after4', user_id: userId, club_group_id: clubgroups[4].get('id')  },
          { title: '헤어 제품 후기', description: '회원 놀이터 입니다', order: 4, url: 'after5', user_id: userId, club_group_id: clubgroups[4].get('id')  },

          { title: '연예인', description: '회원 놀이터 입니다', order: 0, url: 'play1', user_id: userId, club_group_id: clubgroups[5].get('id')  },
          { title: '헤어 스타일', description: '회원 놀이터 입니다', order: 1, url: 'play2', user_id: userId, club_group_id: clubgroups[5].get('id')  },
          { title: '토론하기', description: '회원 놀이터 입니다', order: 2, url: 'play3', user_id: userId, club_group_id: clubgroups[5].get('id')  },
        ]);
    })
    .then(function() {
      return model.Club.findAll();
    })

    // Club Type
    .then(function (clubs) {
      seed.clubs = clubs;
      return model
        .ClubType
        .create({name: '일반게시판'});
    })

    // Club Setting
    .then(function() {
      var bulks = [];
      for (var cKey in seed.clubs) {
        bulks.push({
          using: 1,
          rules: null,
          club_type_id: 1,
          club_id: seed.clubs[cKey].get('id')
        })
      }
      return model
        .ClubSetting
        .bulkCreate(bulks);
    })
    .then(function() {
      return model.ClubSetting.findAll();
    })

    // Club Permission
    .then(function(clubsettings) {
      seed.clubsettings = clubsettings;
      var bulks = [];
      for (var cKey in seed.clubs) {
        bulks.push({
          club_id: seed.clubs[cKey].get('id')
        })
      }
      return model
        .ClubPermission
        .bulkCreate(bulks);
    })
    .then(function() {
      return model.ClubPermission.findAll();
    })

    // Permission
    .then(function(clubpermissions) {
      seed.clubpermissions = clubpermissions;
      return model
        .Permission
        .bulkCreate([
          { name: '클럽 읽기', type: 'readClub'},
          { name: '클럽 만들기', type: 'writeClub'},
          { name: '글 읽기', type: 'readPost'},
          { name: '글 쓰기', type: 'writePost'},
          { name: '댓글 읽기', type: 'readComment'},
          { name: '댓글 쓰기', type: 'writeComment'},
        ]);
    })
    .then(function() {
      return model.Permission.findAll();
    })

    // Membership Permission
    .then(function(permissions) {
      seed.permissions = permissions;

      var bulks = [];
      for (var mKey in seed.memberships) {
        for (var pKey in seed.permissions) {
          for (var cpKey in seed.clubpermissions) {
            bulks.push({
              membership_id: seed.memberships[mKey].get('id'),
              permission_id: seed.permissions[pKey].get('id'),
              club_permission_id: seed.clubpermissions[cpKey].get('id'),
            });
          }
        }
      }
      return model
        .MembershipPermission
        .bulkCreate(bulks)
    })

    // Grade Permission
    .then(function() {
      var bulks = [];
      for (var gKey in seed.grades) {
        for (var pKey in seed.permissions) {
          for (var cpKey in seed.clubpermissions) {
            bulks.push({
              grade_id: seed.grades[gKey].get('id'),
              permission_id: seed.permissions[pKey].get('id'),
              club_permission_id: seed.clubpermissions[cpKey].get('id'),
            });
          }
        }
      }
      return model
        .GradePermission
        .bulkCreate(bulks)
    })

    // Profile Permission
    .then(function() {
      return model
        .ProfilePermission
        .bulkCreate([
          { colum: 'sex', value: 'woman',  permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
        ])
    })

    // Prefix Permission
    .then(function() {
      return model
        .Prefix
        .bulkCreate([
          { name: '공지', club_id: seed.clubs[0].get('id') },
          { name: '공지', club_id: seed.clubs[1].get('id') },
          { name: '공지', club_id: seed.clubs[2].get('id') },
          { name: '공지', club_id: seed.clubs[3].get('id') },
          { name: '공지', club_id: seed.clubs[4].get('id') },
          { name: '공지', club_id: seed.clubs[5].get('id') },
          { name: '공지', club_id: seed.clubs[6].get('id') },
          { name: '공지', club_id: seed.clubs[7].get('id') },
          { name: '공지', club_id: seed.clubs[8].get('id') },
          { name: '공지', club_id: seed.clubs[9].get('id') },
          { name: '공지', club_id: seed.clubs[10].get('id') },
          { name: '공지', club_id: seed.clubs[11].get('id') },
          { name: '공지', club_id: seed.clubs[12].get('id') },
          { name: '공지', club_id: seed.clubs[13].get('id') },
          { name: '공지', club_id: seed.clubs[14].get('id') },
          { name: '공지', club_id: seed.clubs[15].get('id') },
          { name: '공지', club_id: seed.clubs[16].get('id') },
        ]);
    })
    .then(function() {

      if (process.env.NODE_ENV === 'production') {
        return true;
      } else {
        var modelResult = [];
        return Promise.each([
            {name: '우리'},
            {name: '친구'},
            {name: '안녕'},
            {name: '우리들'},
            {name: '만가워'},
          ], function(tag, index, length) {
            return model.Tag.findOrCreate({where : tag})
              .spread(function (data, created) {
                if (created) {
                  modelResult.push(data);
                }
              })
          })
          .then(function(result) {
            console.log(result, modelResult);
            return model.Post.create({
              title: 'title',
              content: 'content',
              club_id: 1,
              user_id: userId
            })
          })
          .then(function (post) {
            return post.setTags(modelResult);
          })
          .then(function (post) {
            return model.Post.findOne({
              include: [
                { model: model.Tag, attributes: ['name'] },
                { model: model.User, attributes: ['nick', 'id'] },
              ]
            })
          })
          .then(function (post) {
            return console.log(JSON.parse(JSON.stringify(post)));
          })
      }
    })
    .then(function() {
      cb();
    })
};


Seed.prototype.addPosts = function (number, cb) {
  var seed = {};
  var userId = 1;

  var tagsArray = [];
  var postArray = [];
  return Promise.each([
      {name: '우리'},
      {name: '친구'},
      {name: '안녕'},
      {name: '우리들'},
      {name: '만가워'}
    ], function (tag, index, length) {
      return model.Tag.findOrCreate({where: tag})
        .spread(function (data, created) {
          tagsArray.push(data);
        });
    })
    .then(function () {
      var postInit = [];
      for (var i = 0; i < number; i++ ) {
        for (var j = 1; j < 18; j++) {
          postInit.push({ title: 'The title ' + i, content: 'content' + i, club_id: j, user_id: userId});
        }
      }
      return Promise.each(postInit, function(post, index, length) {
        return model.Post.create(post)
          .then(function (data) {
            postArray.push(data);
          });
      });
    })
    .then(function () {
      return postArray.map(function (post) {
        post.setTags(tagsArray);
      });
    })
    .then(function () {
      cb();
    });
};

Seed.prototype.addComments = function (number, cb) {
  var seed = {};
  var userId = 1;

  return model
    .Post
    .findAll()
    .then(function (posts) {
      return Promise.each(posts, function (post, index, length) {
        var initComment = [];
        for (var i = 0; i < number; i++) {
          initComment.push({content: 'Hello comment' + i, post_id: post.get('id'), user_id: userId});
        }

        return post
          .increment('comment_count', {by: number})
          .then(function () {
            return model
              .Comment
              .bulkCreate(initComment);
          });
      });
    })
    .then(function (comment) {
      cb();
    });
};

module.exports = new Seed();
