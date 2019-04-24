const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  DB.query('select * from users').then((usersData) => {
    res.json({ data: usersData[0]}).status(200);
  });
});

module.exports = router;