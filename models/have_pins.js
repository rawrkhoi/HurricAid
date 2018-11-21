'use strict';
module.exports = (sequelize, DataTypes) => {
  const have_pins = sequelize.define('have_pins', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_phone: DataTypes.INTEGER,
    food: DataTypes.BOOLEAN,
    water: DataTypes.BOOLEAN,
    shelter: DataTypes.BOOLEAN,
    other: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {});
  have_pins.associate = function(models) {
    // associations can be defined here
  };
  return have_pins;
};