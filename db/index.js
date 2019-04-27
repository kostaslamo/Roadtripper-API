// const Sequelize = require('sequelize');
const massive = require('massive');
const config = require('../configurations/config');

const init = () => new Promise((resolve, reject) => {
  console.log('rds', JSON.stringify(config.rds));
  massive({
    host: config.rds.host,
    port: config.rds.port,
    database: config.rds.db,
    user: config.rds.user,
    password: config.rds.pass,
  }).then((db) => {
    resolve(db)
  }).catch((err) => {
    reject(err);
  });
});

module.exports = {
  init
};