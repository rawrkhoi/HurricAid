'use strict';
module.exports = (sequelize, DataTypes) => {
  const pin = sequelize.define('pin', {
    help: DataTypes.BOOLEAN,
    have: DataTypes.BOOLEAN,
    id_supplies: DataTypes.INTEGER,
    address: DataTypes.STRING,
    id_phone: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {});
  pin.associate = function(models) {
    // associations can be defined here
  };
  return pin;
};