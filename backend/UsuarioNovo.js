const bcrypt = require('bcrypt');
const { connection } = require('./db');

const username = 'fa_mello';
const password = 'Hesoyam@1991';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  connection.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hash], (err) => {
    if (err) throw err;
    console.log('Usuário inserido');
    process.exit();
  });
});
