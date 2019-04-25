const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../configurations/config');

const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body;
  if (email && email === 'kostaslamo91@gmail.com') {
    if (password && password === 'kostaslamo91') {
      //if eveything is okey let's create our token 
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
  } else{
    res.json({message:"user not found !"})
  }
});

module.exports = router;