module.exports = {
  secret : process.env.API_SECRET,
  rds : {
    dialeg: 'postgres',
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT || 5432,
    db: process.env.RDS_DB,
    user: process.env.RDS_USER,
    pass: process.env.RDS_PASS,
  },
}