'use strict';
module.exports = (sequelize, DataTypes) => {
  const pin = sequelize.define('pin', {
    help: DataTypes.BOOLEAN,
    have: DataTypes.BOOLEAN,
    message: DataTypes.STRING,
    id_phone: DataTypes.INTEGER,
    id_location: DataTypes.INTEGER
  }, {});
  pin.associate = function(models) {
    // associations can be defined here
  };
  return pin;
};