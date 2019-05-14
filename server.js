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
const admin = require('./core/admin');

const logger = log4js.getLogger();
logger.level = 'debug';

const app = express();
const ProtectedRoutes = express.Router();
const AdminRoutes = express.Router();
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

app.use('/admin', AdminRoutes);

/* Check if user access token provided for protected routes */
ProtectedRoutes.use((req, res, next) =>{
  // check header for the token
  if (req.originalUrl === '/api/users' && req.method === 'POST') {
    next();
  } else {
    const token = req.headers['access-token'];
    // decode token
    if (token) {
      // verifies secret and checks if the token is expired
      jwt.verify(token, config.secret, (err, decoded) => {      
        if (err) {
          return res.json({ message: 'invalid token' });    
        } else {
          // if everything is good, save to request for use in other routes
          if (req.originalUrl === '/api/users/') {
            if (req.headers.admin && req.headers.admin === process.env.ADMIN) {
              req.decoded = decoded;
              next();
            } else {
              res.json({ status: 'ERROR', msg: 'Non Admins could not get all users data'});
            }
          } else {
            req.decoded = decoded;
            console.log('req decoded', req.decoded);
            next();
          }
        }
      });
    } else {
      // if there is no token  
      res.send({ 
        message: 'No token provided.' 
      });
    }
  }
});

/* Check if admin access token is provided for admin routes */
AdminRoutes.use((req, res, next) => {
  const token = req.headers['admin-access-token'];
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, config.adminSecret, (err, decoded) => {      
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
})

/* Unprotected Routes */
app.use('/authenticate', authenticate);

/* Protected Routes */
app.use('/api/users', users);

/* Admin Protected Routes */
app.use('/admin', admin);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Service is Up and Running!' }).status(200);
});

app.listen(port, () => {
  logger.info(`API STARTS on port [${port}]`);
  setInterval(() => {
    logger.info('API is running');
  }, 60000);
});


