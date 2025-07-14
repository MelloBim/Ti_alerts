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
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = e => {
    setForm({ ...form, imagem: e.target.files[0] });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    await axios.post('http://localhost:3001/api/schedules', data);
    setForm({ texto: '', tipo: 'DIARIO', hora: '', dias_semana: '', intervalo: '', imagem: null });
    onSuccess();
  };

  return (
    <form className="form-agendamento" onSubmit={handleSubmit}>
      <label>Texto da Mensagem:</label>
      <input name="texto" placeholder="Texto da mensagem" onChange={handleChange} value={form.texto} required />

      <label>Tipo:</label>
      <select name="tipo" onChange={handleChange} value={form.tipo}>
        <option value="DIARIO">Diário</option>
        <option value="SEMANAL">Semanal</option>
        <option value="MENSAL">Mensal</option>
        <option value="RECORRENTE">Recorrente</option>
      </select>

      <label>Hora de Execução:</label>
      <input name="hora" type="time" onChange={handleChange} value={form.hora} />

      <label>Dias da Semana:</label>
      <input name="dias_semana" placeholder="Ex: SEG,QUA,SEX" onChange={handleChange} value={form.dias_semana} />

      <label>Intervalo (horas):</label>
      <input name="intervalo" placeholder="Ex: 8" onChange={handleChange} value={form.intervalo} />

      <label>Imagem:</label>
      <input name="imagem" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />

      <button type="submit">Salvar Agendamento</button>
    </form>
  );
}

export default ScheduleForm;