import React, { useState } from 'react';
import axios from 'axios';
import '../css/ScheduleForm.css';

function ScheduleForm({ onSuccess }) {
  const [form, setForm] = useState({
    texto: '',
    tipo: 'DIARIO',
    hora: '',
    dias_semana: '',
    intervalo: '',
    imagem: null
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setForm(prev => ({ ...prev, imagem: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await axios.post('http://localhost:3001/api/schedules', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setForm({
        texto: '',
        tipo: 'DIARIO',
        hora: '',
        dias_semana: '',
        intervalo: '',
        imagem: null
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
      } else {
        console.error('Erro ao salvar agendamento:', err);
        alert('Erro ao salvar agendamento. Verifique os campos.');
      }
    }
  };

  return (
    <form className="form-agendamento" onSubmit={handleSubmit}>
      <label>Texto da Mensagem:</label>
      <input
        name="texto"
        placeholder="Texto da mensagem"
        onChange={handleChange}
        value={form.texto}
        required
      />

      <label>Tipo:</label>
      <select name="tipo" onChange={handleChange} value={form.tipo}>
        <option value="DIARIO">Diário</option>
        <option value="SEMANAL">Semanal</option>
        <option value="MENSAL">Mensal</option>
        <option value="RECORRENTE">Recorrente</option>
      </select>

      <label>Hora de Execução:</label>
      <input
        name="hora"
        type="time"
        onChange={handleChange}
        value={form.hora}
      />

      <label>Dias da Semana:</label>
      <input
        name="dias_semana"
        placeholder="Ex: SEG,QUA,SEX"
        onChange={handleChange}
        value={form.dias_semana}
      />

      <label>Intervalo (horas):</label>
      <input
        name="intervalo"
        placeholder="Ex: 8"
        onChange={handleChange}
        value={form.intervalo}
      />

      <label>Imagem:</label>
      <input
        name="imagem"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />

      <button type="submit">Salvar Agendamento</button>
    </form>
  );
}

export default ScheduleForm;
