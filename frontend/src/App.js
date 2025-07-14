import React, { useState, useEffect } from 'react';
import ScheduleForm from './components/ScheduleForm';
import Login from './components/Login';
import axios from 'axios';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('token') !== null;
  });
  const [schedules, setSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState('listar');

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/schedules', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        setLoggedIn(false);
      } else {
        console.error('Erro ao buscar agendamentos:', err);
      }
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:3001/api/login', {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);
      setLoggedIn(true);
      fetchSchedules();
    } catch (err) {
      alert('Usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSchedules();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        setLoggedIn(false);
      } else {
        console.error('Erro ao excluir:', err);
      }
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchSchedules();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <h1>TI Alerts - Google Chat</h1>
      <button onClick={handleLogout} style={{ float: 'right' }}>Sair</button>

      <div className="tabs">
        <button onClick={() => setActiveTab('criar')} className={activeTab === 'criar' ? 'active' : ''}>
          Novo Agendamento
        </button>
        <button onClick={() => setActiveTab('listar')} className={activeTab === 'listar' ? 'active' : ''}>
          Agendamentos Criados
        </button>
      </div>

      {activeTab === 'criar' && <ScheduleForm onSuccess={fetchSchedules} />}

      {activeTab === 'listar' && (
        <div className="agendamentos">
          <h2>Agendamentos Ativos</h2>
          <ul>
            {schedules.map(s => (
              <li key={s.id} className="item-agendamento">
                <div>
                  <strong>{s.texto}</strong> - {s.tipo_periodicidade} às {s.hora_execucao}
                </div>
                <button onClick={() => handleDelete(s.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
