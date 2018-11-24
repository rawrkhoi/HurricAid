'use strict';
module.exports = (sequelize, DataTypes) => {
  const supplies = sequelize.define('supplies', {
    food: DataTypes.BOOLEAN,
    water: DataTypes.BOOLEAN,
    shelter: DataTypes.BOOLEAN,
    other: DataTypes.STRING
  }, {});
  supplies.associate = function(models) {
    // associations can be defined here
  };
  return supplies;
};