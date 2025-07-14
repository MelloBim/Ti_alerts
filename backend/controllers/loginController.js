const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

const loginController = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro interno' });
    if (results.length === 0) return res.status(401).json({ message: 'Usuário não encontrado' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: 'Senha inválida' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.json({ token });
  });
};

module.exports = loginController;