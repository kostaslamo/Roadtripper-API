const Sequelize = require('sequelize');

const rds = {
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT || 5432,
  db: process.env.RDS_DB,
  user: process.env.RDS_USER,
  pass: process.env.RDS_PASS,
};

// const init = () => new Promise((resolve, reject) => {
//   massive({
//     host: rds.host,
//     port: rds.port,
//     database: rds.db,
//     user: rds.user,
//     password: rds.pass,
//   }).then(resolve)
//     .catch(reject);
// });

const init = () => {
  global.DB = new Sequelize(rds.db, rds.user, rds.pass, {
    host: rds.host,
    dialect: 'postgres'
  });
}


module.exports = {
  init,
};