'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {});
  location.associate = function(models) {
    // associations can be defined here
  };
  return location;
};