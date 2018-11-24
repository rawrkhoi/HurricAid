'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.INTEGER
  }, {});
  location.associate = function(models) {
    // associations can be defined here
  };
  return location;
};