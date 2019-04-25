const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../configurations/config');
const { encrypt, decrypt } = require('../services/encryptDecrypt');

const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body;
  DB.users.find().then((userData) => {
    const data = userData;
    const emails = data.map(d => d.email);
    const passwords = data.map(d => decrypt(d.password_digest));
    if (email && emails.indexOf(email) !== -1) {
      if (password && passwords.indexOf(password) !== -1) {
        const payload = {
          check:  true
        };
        const token = jwt.sign(payload, config.secret, {
          expiresIn: 1440 // expires in 24 hours
        });
        res.json({
          status: 'OK',
          data: {
            token,
          },
        });
      } else {
        res.json({ status: 'FAILED', data: { message: 'Invalid password', errCode: 'pass' } });
      }
    } else {
      res.json({ status: 'FAILED', data: { message: 'Email not found!', errCode: 'email' } });
    }
  });
});

router.post('/encrypt', (req, res) => {
  const { text } = req.body;
  const encryptedText = encrypt(text);
  res.json({ encryptedText });
});

module.exports = router;