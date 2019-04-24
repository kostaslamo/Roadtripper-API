const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const dbFunctions = require('./db');

dbFunctions.init().then((db) => {
  global.DB = db;
  console.log('DB initiated')
}).catch(dbErr => {
  console.log(`Error initiating Database ${JSON.stringify(dbErr)}`);
});

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

app.get('/', (req, res) => {
  res.json({ msg: 'OK' }).status(200);
});

app.listen(port, () => {
  logger.debug(`API STARTS on port [${port}]`);
  setInterval(() => {
    logger.debug('API is running');
  }, 60000);
});


