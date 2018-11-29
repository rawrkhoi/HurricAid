'use strict';
module.exports = (sequelize, DataTypes) => {
  const pin = sequelize.define('pin', {
    help: DataTypes.BOOLEAN,
    have: DataTypes.BOOLEAN,
    message: DataTypes.STRING,
    id_phone: DataTypes.INTEGER,
    address: DataTypes.STRING,
    latitude: DataTypes.STRING,
<<<<<<< HEAD
    longitude: DataTypes.STRING,
    // description_supply: DataTypes.STRING,
=======
    longitude: DataTypes.STRING
>>>>>>> 53f40fc83868af1ca6e940a75f812427f5caade5
  }, {});
  pin.associate = function(models) {
    // associations can be defined here
  };
  return pin;
};