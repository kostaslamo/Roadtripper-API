const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../configurations/config');

const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body;
  DB.query('select email,password_digest from users').then((userData) => {
    const data = userData[0];
    const emails = data.map(d => d.email);
    const passwords = data.map(d => d.password_digest);
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
        res.json({ message: "please check your password !" });
      }
    } else {
      res.json({message:"user not found !"})
    }
  });
});

module.exports = router;