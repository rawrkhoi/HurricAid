const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models/');

// For Auth
passport.use('checkAuth', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
  function (username, password, done) {
    // this is mongoose syntax need sequalize
    db.credential.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser((email, done) => {
  done(null, email);
});

passport.deserializeUser((email, done) => {
  db.credential.find({ where: { id: email.id } })
    .success(email => {
      done(null, email);
    })
    .error(err => {
      done(err, null);
    })
});

// If first auth did not work, try this
// purpose.use(new LocalStrategy((username, password, done) => {
//   db.credential.find({where:{email: username}})
//     .success(email => {
//       passwd = email ? email.password : '';
//       isMatch = db.credential.validPassword(password, passwd, done, email)
//     });
//   }
// ));
