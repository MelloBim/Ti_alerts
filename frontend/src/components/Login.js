import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form className="form-agendamento" onSubmit={handleSubmit}>
        <label>Usuário:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />

        <label>Senha:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;