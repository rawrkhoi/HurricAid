'use strict';
module.exports = (sequelize, DataTypes) => {
  const help_pins = sequelize.define('help_pins', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_phone: DataTypes.INTEGER,
    address: DataTypes.STRING,
    message: DataTypes.STRING,
  }, {});
  help_pins.associate = function(models) {
    // associations can be defined here
  };
  return help_pins;
};