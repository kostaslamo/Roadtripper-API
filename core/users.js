const express = require('express');
const { encrypt } = require('../services/encryptDecrypt');

const router = express.Router();

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

router.get('/data', (req, res) => { 
  if (req.decoded) {
    const { user } = req.decoded;
    delete user.password_digest;
    res.json({ status: 'OK', data: { user } });
  } else {
    res.json({ status: 'FAILED', data: { message: 'User not found' }});
  }
})

module.exports = router;