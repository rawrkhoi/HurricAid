'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      help: {
        type: Sequelize.BOOLEAN
      },
      have: {
        type: Sequelize.BOOLEAN
      },
      id_supplies: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      id_phone: {
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('pins');
  }
};