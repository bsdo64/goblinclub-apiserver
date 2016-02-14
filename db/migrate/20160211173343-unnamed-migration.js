'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable('users1', { id: Sequelize.INTEGER });
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('users1');
  }
};
