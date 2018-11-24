'use strict';
module.exports = (sequelize, DataTypes) => {
  const commands = sequelize.define('commands', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    command: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  commands.associate = function(models) {
    // associations can be defined here
  };
  return commands;
};