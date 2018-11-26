'use strict';

const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const credential = sequelize.define('credential', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
      classMethods: {
        validPassword: (password, cpassword, done, user) => {
          bcrypt.compare(password, cpassword, (err, isMatch) => {
            if (err) { console.log(err); }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        }
      }
    },
  );
  credential.hook('beforeCreate', (user, fn) => {
    let salt = bcrypt.genSalt(salty, (err, salt) => {
      return salt;
    });
    bcrypt.hash(credential.password, salt, null, (err, hash) => {
      if (err) { return next(err); };
      credential.password = hash;
      return fn(null, user);
    });
  });
  credential.associate = function(models) {
    // associations can be defined here
  };
  return credential;
};