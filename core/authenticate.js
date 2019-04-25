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
          message: 'Authenticated',
          token: token
        });
      } else {
        res.json({ errCode: 'pass', message: 'Invalid password' });
      }
    } else {
      res.json({ errCode: 'email', message: 'Email not found!' })
    }
  });
});

router.post('/encrypt', (req, res) => {
  const { text } = req.body;
  const encryptedText = encrypt(text);
  res.json({ encryptedText });
});

module.exports = router;