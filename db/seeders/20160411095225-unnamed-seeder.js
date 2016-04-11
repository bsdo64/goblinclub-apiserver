'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    var userId;

    return queryInterface.bulkInsert('Users', [{
      email: 'bsdo@naver.com',
      password: 'Hello world',
      nick: '고블린클럽'
    }], {})
      .then(function (id) {
        userId = id;
        return queryInterface.bulkInsert('UserActivities', [{
          user_id: userId
        }]);
      })
      .then(function() {
        return queryInterface.bulkInsert('UserProfiles', [{
          birth: new Date(), sex: 1, description: '안녕',
          joined_at: new Date(), user_id: userId
        }]);
      })
      .then(function() {
        queryInterface.bulkInsert('actions', [
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
          { name: 'paied', type: 'bool' }
        ]);
      })
      .then(function() {
        queryInterface.bulkInsert('memberships', [
          { name: '손님'},
          { name: '일반 회원'},
          { name: '정기 회원'},
          { name: '스텝'},
          { name: '관리자'}
        ]);
      })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {})
      .then(function() {

      })
      .then(function() {

      })
  }
};
