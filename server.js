const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const config = require('./configurations/config');
const dbFunctions = require('./db');

/* Initiate DB */
dbFunctions.init();

/* Require Paths */
const authenticate = require('./core/authenticate');
const users = require('./core/users');

const logger = log4js.getLogger();
logger.level = 'debug';

const app = express();
const port = process.env.PORT || 6000;

app.use(bodyParser.json({
  type: '*/*',
  limit: '50mb',
}));

app.use((req, res, next) => {
  console.log('Incoming Request');
  next();
});

/* Routes */
app.use('/authenticate', authenticate);
app.use('/users', users);

app.get('/', (req, res) => {
  res.json({ msg: 'OK' }).status(200);
});

app.listen(port, () => {
  logger.debug(`API STARTS on port [${port}]`);
  setInterval(() => {
    logger.debug('API is running');
  }, 60000);
});


