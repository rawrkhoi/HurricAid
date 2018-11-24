'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name_first: DataTypes.STRING,
    name_last: DataTypes.STRING,
    id_credential: DataTypes.INTEGER,
    id_phone: DataTypes.INTEGER,
    id_location: DataTypes.INTEGER,
    url_photo: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};