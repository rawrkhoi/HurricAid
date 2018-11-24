'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('supplies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('supplies');
  }
};