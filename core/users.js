const express = require('express');
const { encrypt } = require('../services/encryptDecrypt');

const router = express.Router();

router.get('/byId/:id', (req, res) => {
  const { id } = req.params;
  DB.users.findOne({ id }).then((usersData) => {
    res.json({ status: 'OK', data: usersData}).status(200);
  }).catch(err => res.json({ status: 'FAILED', err: JSON.stringify( err) }));
});

router.post('/', (req, res) => {
  const { email, passwordDigest, phone, firstname, lastname, gender, dob, notes, metadata } = req.body;
  if (email && passwordDigest) {
    const encryptedPass = encrypt(passwordDigest);
    DB.users.insert({ email, password_digest: encryptedPass, phone, firstname, lastname, gender, dob, notes, metadata })
      .then((user) => res.json({ status: 'OK', data: user }))
      .catch((err) => res.json({ status: 'FAILED', err: JSON.stringify(err) }));
  } else {
    res.json({ status: 'FAILED', data: { message: 'Please provide both email and password' }});
  }
});

module.exports = router;