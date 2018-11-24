'use strict';
module.exports = (sequelize, DataTypes) => {
  const credential = sequelize.define('credential', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  credential.associate = function(models) {
    // associations can be defined here
  };
  return credential;
};