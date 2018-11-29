'use strict';
module.exports = (sequelize, DataTypes) => {
  const supply_info = sequelize.define('supply_info', {
    id_supply: DataTypes.INTEGER,
    id_pin: DataTypes.INTEGER
  }, {});
  supply_info.associate = function(models) {
    // associations can be defined here
  };
  return supply_info;
};