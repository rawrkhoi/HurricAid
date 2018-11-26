'use strict';
module.exports = (sequelize, DataTypes) => {
  const supply = sequelize.define('supply', {
    type: DataTypes.STRING
  }, {});
  supply.associate = function(models) {
    // associations can be defined here
  };
  return supply;
};