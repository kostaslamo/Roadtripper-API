const massive = require('massive');

const rds = {
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT || 5432,
  db: process.env.RDS_DB,
  user: process.env.RDS_USER,
  pass: process.env.RDS_PASS,
};

const init = () => new Promise((resolve, reject) => {
  massive({
    host: rds.host,
    port: rds.port,
    database: rds.db,
    user: rds.user,
    password: rds.pass,
  }).then(resolve)
    .catch(reject);
});

const clear = db => new Promise((res, rej) => {
  if (process.env.NODE_ENV === 'test') {
    db.clearDB().then(res).catch(rej);
  } else {
    rej(Error('Operation not supported fo this enviroemnt'));
  }
});

module.exports = {
  init,
  clear,
};