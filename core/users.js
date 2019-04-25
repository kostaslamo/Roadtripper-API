const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  DB.users.find().then((usersData) => {
    res.json({ data: usersData}).status(200);
  });
});

router.post('/', (req, res) => {
  const { email, passwordDigest, phone, firstname, lastname, gender, dob, notes, metadata } = req.body;
  const { signup = false } = req.query;
  // If it is First time signup verify email address
  if (signup) {

  } else {

  }
})

module.exports = router;