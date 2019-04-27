const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const log4js = require('log4js');
const config = require('./configurations/config');
const dbFunctions = require('./db');

/* Initiate DB */
dbFunctions.init().then((db) => {
    logger.info('DB initiated!')
    global.DB = db
  }).catch(err => console.log(`Error logging in DB ${JSON.stringify(err)}`));

/* Require Paths */
const authenticate = require('./core/authenticate');
const users = require('./core/users');

const logger = log4js.getLogger();
logger.level = 'debug';

const app = express();
const ProtectedRoutes = express.Router();
const port = process.env.PORT || 6000;

app.use(bodyParser.json({
  type: '*/*',
  limit: '50mb',
}));

app.use((req, res, next) => {
  logger.info('Incoming Request');
  next();
});

app.use('/api', ProtectedRoutes);

/* Check if access token provided for protected routes */
ProtectedRoutes.use((req, res, next) =>{
  // check header for the token
  const token = req.headers['access-token'];
  // decode token
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, config.secret, (err, decoded) =>{      
      if (err) {
        return res.json({ message: 'invalid token' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    // if there is no token  
    res.send({ 
      message: 'No token provided.' 
    });
  }
});

/* Unprotected Routes */
app.use('/authenticate', authenticate);

/* Protected Routes */
app.use('/api/users', users);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Service is Up and Running!' }).status(200);
});

app.listen(port, () => {
  logger.info(`API STARTS on port [${port}]`);
  setInterval(() => {
    logger.info('API is running');
  }, 60000);
});


