const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../configurations/config');
const { encrypt, decrypt } = require('../services/encryptDecrypt');

const router = express.Router();

router.post('/user', (req, res) => {
  const { email, password } = req.body;
  DB.users.find().then((userData) => {
    const data = userData;
    const emails = data.map(d => d.email);
    const passwords = data.map(d => decrypt(d.password_digest, config.encryptionTextKey));
    const user = data.find(user => user.email === email && password === decrypt(user.password_digest, config.encryptionTextKey));
    if (email && emails.indexOf(email) !== -1) {
      if (password && passwords.indexOf(password) !== -1) {
        const token = jwt.sign({ user }, config.secret, {
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

/* Sign JWT Token with username & password and then for admin endpoints verify admin username & pass from env variables */ 
router.post('/admin', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const token = jwt.sign({ username, password }, config.adminSecret, {
      expiresIn: '1h' // expires in 1 hour
    });
    res.json({
      status: 'OK',
      data: {
        token,
      },
    });
  } else {
    res.json({ status: 'FAILED', data: { message: 'You should provide both username & password' } });
  }
});

router.post('/encrypt', (req, res) => {
  const { text } = req.body;
  const encryptedText = encrypt(text);
  res.json({ encryptedText });
});

router.post('/decrypt', (req, res) => {
  const { text, secret } = req.body;
  const decryptedText = decrypt(text, secret);
  res.json({ decryptedText });
});

module.exports = router;