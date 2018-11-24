'use strict';
module.exports = (sequelize, DataTypes) => {
  const command = sequelize.define('command', {
    command: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  command.associate = function(models) {
    // associations can be defined here
  };
  return command;
};