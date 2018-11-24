'use strict';
module.exports = (sequelize, DataTypes) => {
  const phone = sequelize.define('phone', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    number: DataTypes.STRING
  }, {});
  phone.associate = function(models) {
    // associations can be defined here
  };
  return phone;
};