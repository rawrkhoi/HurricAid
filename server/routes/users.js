const express = require('express');
const router = express.Router();
// require user to create new useres in DB
const User = require('../../models/user');
// require moment and use on dates here before entered in the db
const moment = require('moment');

router.post('/signup', (req, res, next) => {
  addToDB(req, res);
});
// has to use user and credential table
async function addToDB(req, res) {
  const user = new User({
    email: req.body.email,
    name_first: req.body.firstName,
    name_last: req.body.lastName,
    phone: req.body.phone,
    // currently no hash function in User
    password: User.hashPassword(req.body.password),
    location: req.body.address,
  });
  try {
    doc = await user.save();
    return res.status(201).json(doc);
  }
  catch(err) {
    return res.status(501).json(err);
  }
};

router.post('/login', (req, res, next) => {
  passport.authenticate('checkAuth', function (err, user, info) {
    if (err) { return res.status(501).json(err); }
    if (!user) { return res.status(501).json(info); }
    req.logIn(user, function (err) {
      if (err) { return res.status(501).json(err); }
      return res.status(200).json({ message: 'Login Success' });
    });
  })(req, res, next);
});

module.exports = router;