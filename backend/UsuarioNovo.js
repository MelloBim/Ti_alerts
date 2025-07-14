const bcrypt = require('bcrypt');
const db = require('./db');

const username = 'admin';
const password = '123456';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  db.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hash], (err) => {
    if (err) throw err;
    console.log('Usuário inserido');
    process.exit();
  });
});
