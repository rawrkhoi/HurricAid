'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('have_pins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_phone: {
        type: Sequelize.INTEGER
      },
      food: {
        type: Sequelize.BOOLEAN
      },
      water: {
        type: Sequelize.BOOLEAN
      },
      shelter: {
        type: Sequelize.BOOLEAN
      },
      other: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('have_pins');
  }
};