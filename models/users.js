'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name_first: DataTypes.STRING,
    name_last: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    id_phone: DataTypes.INTEGER,
    url_photo: DataTypes.STRING,
    emergency_contact: DataTypes.STRING,
    id_location: DataTypes.INTEGER
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
}; 