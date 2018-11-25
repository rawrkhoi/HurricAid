const express = require('express');
const router = express.Router();
// require user to create new useres in DB
const User = require('../../models/users');
// require moment and use on dates here before entered in the db
const moment = require('moment');

router.post('/signup', (req, res, next) => {
  addToDB(req, res);
});

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

module.exports = router;