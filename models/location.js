'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    address: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {});
  location.associate = function(models) {
    // associations can be defined here
  };
  return location;
};