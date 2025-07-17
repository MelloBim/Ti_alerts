const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

const connectionReady = new Promise((resolve, reject) => {
  connection.connect(err => {
    if (err) {
      console.error('Erro ao conectar no MySQL:', err);
      reject(err);
    } else {
      console.log('Conectado ao MySQL');
      resolve();
    }
  });
});

module.exports = { connection, connectionReady };
