const express = require('express');

const router = express.Router();

router.get('/getAllUsers', (req, res) => {
  DB.users.find().then((usersData) => {
    res.json({ status: 'OK', data: usersData}).status(200);
  }).catch(err => res.json({ status: 'FAILED', err: JSON.stringify( err) }));
});

module.exports = router;