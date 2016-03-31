/**
 * Created by dobyeongsu on 2016. 1. 12..
 */
/** @module Faker */

var model = require('../db/models/index');

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
    .create({email: 'bsdo1@naver.com', nick: '고블린클럽1', password: 'goblinclub'})

    // 관리자 세팅
    .then(function(user2) {
      seed.user2 = user2;
      return model
        .User
        .create({email: 'bsdo@naver.com', nick: '고블린클럽', password: 'goblinclub'})
    })

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
        ]);
    })

    // User Membership
    .then(function() {
      return model
        .UserMembership
        .create({user_id: userId, membership_id: seed.memberships[3].get('id')});
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

      return model
        .GradeRequire
        .bulkCreate([
          { grade_id: seed.grades[0].get('id'), action_id: seed.actions[0].get('id'), minValue: 0, maxValue: 10 },
          { grade_id: seed.grades[0].get('id'), action_id: seed.actions[1].get('id'), minValue: 0, maxValue: 10 },
          { grade_id: seed.grades[0].get('id'), action_id: seed.actions[2].get('id'), minValue: 0, maxValue: 10 },
          { grade_id: seed.grades[1].get('id'), action_id: seed.actions[0].get('id'), minValue: 11, maxValue: 30 },
          { grade_id: seed.grades[1].get('id'), action_id: seed.actions[1].get('id'), minValue: 11, maxValue: 30 },
          { grade_id: seed.grades[1].get('id'), action_id: seed.actions[2].get('id'), minValue: 11, maxValue: 30 },
          { grade_id: seed.grades[2].get('id'), action_id: seed.actions[0].get('id'), minValue: 31, maxValue: 40 },
          { grade_id: seed.grades[2].get('id'), action_id: seed.actions[1].get('id'), minValue: 31, maxValue: 40 },
          { grade_id: seed.grades[2].get('id'), action_id: seed.actions[2].get('id'), minValue: 31, maxValue: 40 },
          { grade_id: seed.grades[3].get('id'), action_id: seed.actions[0].get('id'), minValue: 41, maxValue: 50 },
          { grade_id: seed.grades[3].get('id'), action_id: seed.actions[1].get('id'), minValue: 41, maxValue: 50 },
          { grade_id: seed.grades[3].get('id'), action_id: seed.actions[2].get('id'), minValue: 41, maxValue: 50 }
        ]);
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
          { action_id: seed.actions[0].get('id'), action_value: 10, point_value: 11 },
          { action_id: seed.actions[0].get('id'), action_value: 100, point_value: 110 },
          { action_id: seed.actions[1].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[1].get('id'), action_value: 10, point_value: 11 },
          { action_id: seed.actions[1].get('id'), action_value: 100, point_value: 110 },
          { action_id: seed.actions[2].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[2].get('id'), action_value: 10, point_value: 10 },
          { action_id: seed.actions[2].get('id'), action_value: 100, point_value: 100 },
          { action_id: seed.actions[3].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[3].get('id'), action_value: 10, point_value: 10 },
          { action_id: seed.actions[3].get('id'), action_value: 100, point_value: 100 },
          { action_id: seed.actions[4].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[4].get('id'), action_value: 10, point_value: 10 },
          { action_id: seed.actions[4].get('id'), action_value: 100, point_value: 100 },
          { action_id: seed.actions[5].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[5].get('id'), action_value: 10, point_value: 10 },
          { action_id: seed.actions[5].get('id'), action_value: 100, point_value: 100 },
          { action_id: seed.actions[6].get('id'), action_value: 1, point_value: 1 },
          { action_id: seed.actions[6].get('id'), action_value: 10, point_value: 10 },
          { action_id: seed.actions[6].get('id'), action_value: 100, point_value: 100 },
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
          { action_id: seed.actions[10].get('id'), action_value: 10, reputation_value: 11 },
          { action_id: seed.actions[10].get('id'), action_value: 100, reputation_value: 110 },
          { action_id: seed.actions[11].get('id'), action_value: 1, reputation_value: 1 },
          { action_id: seed.actions[11].get('id'), action_value: 10, reputation_value: 11 },
          { action_id: seed.actions[11].get('id'), action_value: 100, reputation_value: 110 },
          { action_id: seed.actions[12].get('id'), action_value: 1, reputation_value: 2 },
          { action_id: seed.actions[12].get('id'), action_value: 10, reputation_value: 20 },
          { action_id: seed.actions[12].get('id'), action_value: 100, reputation_value: 200 },
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
      return model
        .ClubSetting
        .bulkCreate([
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[0].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[1].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[2].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[3].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[4].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[5].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[6].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[7].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[8].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[9].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[10].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[11].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[12].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[13].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[14].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[15].get('id') },
          { using: 1, rules: null, club_type_id: 1, club_id: seed.clubs[16].get('id') },
        ]);
    })
    .then(function() {
      return model.ClubSetting.findAll();
    })

    // Club Permission
    .then(function(clubsettings) {
      seed.clubsettings = clubsettings;
      return model
        .ClubPermission
        .bulkCreate([
          { club_id: 1 },
          { club_id: 2 },
          { club_id: 3 },
          { club_id: 4 },
          { club_id: 5 },
          { club_id: 6 },
          { club_id: 7 },
          { club_id: 8 },
          { club_id: 9 },
          { club_id: 10 },
          { club_id: 11 },
          { club_id: 12 },
          { club_id: 13 },
          { club_id: 14 },
          { club_id: 15 },
          { club_id: 16 },
          { club_id: 17 }
        ]);
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
      return model
        .MembershipPermission
        .bulkCreate([
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[0].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },


          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[1].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },


          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[2].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },


          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[0].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[1].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[2].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[3].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[4].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { membership_id: seed.memberships[3].get('id'), permission_id: permissions[5].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

        ])
    })

    // Grade Permission
    .then(function() {
      return model
        .GradePermission
        .bulkCreate([
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[0].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },


          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[1].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },


          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[2].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },


          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[0].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[1].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[2].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[3].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[4].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[0].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[1].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[2].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[3].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[4].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[5].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[6].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[7].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[8].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[9].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[10].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[11].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[12].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[13].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[14].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[15].get('id') },
          { grade_id: seed.grades[3].get('id'), permission_id: seed.permissions[5].get('id'), club_permission_id: seed.clubpermissions[16].get('id') },

        ])
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
      cb();
    });
};

module.exports = new Seed();