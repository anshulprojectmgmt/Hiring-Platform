const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12647103",
  password: "ql8LSMAjJH",
  database: "sql12647103",
  port: 3306,
}).promise();

module.exports = pool;
