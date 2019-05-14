const express = require('express');

const router = express.Router();

router.get('/users/getAllUsers', (req, res) => {
  DB.users.find().then((usersData) => {
    res.json({ status: 'OK', data: usersData}).status(200);
  }).catch(err => res.json({ status: 'FAILED', err: JSON.stringify( err) }));
});

router.get('/users/byId/:id', (req, res) => {
  const { id } = req.params;
  DB.users.findOne({ id }).then((usersData) => {
    res.json({ status: 'OK', data: usersData}).status(200);
  }).catch(err => res.json({ status: 'FAILED', err: JSON.stringify( err) }));
});

module.exports = router;