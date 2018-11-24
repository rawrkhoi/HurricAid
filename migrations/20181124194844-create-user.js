'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name_first: {
        type: Sequelize.STRING
      },
      name_last: {
        type: Sequelize.STRING
      },
      id_credential: {
        type: Sequelize.INTEGER
      },
      id_phone: {
        type: Sequelize.INTEGER
      },
      id_location: {
        type: Sequelize.INTEGER
      },
      url_photo: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};