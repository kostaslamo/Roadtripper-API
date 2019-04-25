const Sequelize = require('sequelize');
const config = require('../configurations/config');

const init = () => {
  global.DB = new Sequelize(config.rds.db, config.rds.user, config.rds.pass, {
    host: config.rds.host,
    dialect: config.rds.dialeg,
  });
}

module.exports = {
  init,
};