const db = require('../db');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const jobs = [];

function initializeScheduler() {
  db.query('SELECT * FROM agendamentos WHERE ativo = 1', (err, results) => {
    if (err) return console.error(err);
    console.log("Agendamentos encontrados:", results);
    results.forEach(schedule => scheduleJob(schedule));
  });
}

function scheduleJob(agendamento) {
  console.log(`Agendando: ${agendamento.texto} às ${agendamento.hora_execucao}`);
  let cronExp;
  const hora = agendamento.hora_execucao.split(':');

  switch (agendamento.tipo_periodicidade) {
    case 'DIARIO':
      cronExp = `${hora[1]} ${hora[0]} * * *`;
      break;
    case 'SEMANAL':
      const dias = diasToCron(agendamento.dias_semana);
      cronExp = `${hora[1]} ${hora[0]} * * ${dias}`;
      break;
    case 'RECORRENTE':
      const intervaloMinutos = parseInt(agendamento.intervalo_horas || 0) * 60;
      cronExp = `*/${intervaloMinutos} * * * *`;
      break;
    default:
      console.warn(`Tipo de periodicidade desconhecido: ${agendamento.tipo_periodicidade}`);
      return;
  }

  const job = cron.schedule(cronExp, () => {
    const imageUrl = agendamento.caminho_imagem
      ? `${process.env.SERVER_URL || 'http://localhost:3001'}/uploads/${agendamento.caminho_imagem}`
      : null;
    postToGoogleChat(agendamento.texto, imageUrl);
  });

  jobs.push(job);
}

function diasToCron(diasStr) {
  const map = { DOM: 0, SEG: 1, TER: 2, QUA: 3, QUI: 4, SEX: 5, SAB: 6 };
  return diasStr
    .split(',')
    .map(d => map[d.trim()])
    .filter(n => n !== undefined)
    .join(',');
}

async function postToGoogleChat(texto, imagemUrl) {
  const payload = imagemUrl
    ? {
        cards: [
          {
            sections: [
              {
                widgets: [
                  { image: { imageUrl: imagemUrl } },
                  { textParagraph: { text: texto } }
                ]
              }
            ]
          }
        ]
      }
    : { text: texto };

  try {
    const res = await axios.post(process.env.CHAT_WEBHOOK_URL, payload);
    if (res.status === 200) {
      console.log(`Mensagem enviada para Google Chat: ${texto}`);
    } else {
      console.error(`Erro ao enviar para Google Chat: ${res.status}`);
    }
  } catch (error) {
    console.error('Erro de conexão com o webhook:', error.message);
  }
}

exports.initializeScheduler = initializeScheduler;

exports.createSchedule = (req, res) => {
  const { texto, tipo, hora, dias_semana, intervalo } = req.body;
  const imagem = req.file ? req.file.filename : null;

  const query = `INSERT INTO agendamentos 
    (texto, caminho_imagem, tipo_periodicidade, hora_execucao, dias_semana, intervalo_horas, ativo) 
    VALUES (?, ?, ?, ?, ?, ?, 1)`;

  db.query(query, [texto, imagem, tipo, hora, dias_semana, intervalo], (err, result) => {
    if (err) {
      console.error('Erro ao inserir agendamento:', err);
      return res.status(500).json({ message: 'Erro ao criar agendamento', error: err });
    }

    // Inicia o job imediatamente após criar
    const novoAgendamento = {
      id: result.insertId,
      texto,
      caminho_imagem: imagem,
      tipo_periodicidade: tipo,
      hora_execucao: hora,
      dias_semana,
      intervalo_horas: intervalo
    };

    scheduleJob(novoAgendamento);

    res.status(201).json({ message: 'Agendamento criado com sucesso' });
  });
};

exports.getAll = (req, res) => {
  db.query('SELECT * FROM agendamentos', (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar agendamentos', error: err });
    res.status(200).json(results);
  });
};

exports.updateSchedule = (req, res) => {
  const { id } = req.params;
  const { texto, tipo, hora, dias_semana, intervalo } = req.body;
  const imagem = req.file ? req.file.filename : null;

  const query = `UPDATE agendamentos 
    SET texto=?, tipo_periodicidade=?, hora_execucao=?, dias_semana=?, intervalo_horas=?${imagem ? ', caminho_imagem=?' : ''} 
    WHERE id=?`;

  const params = imagem
    ? [texto, tipo, hora, dias_semana, intervalo, imagem, id]
    : [texto, tipo, hora, dias_semana, intervalo, id];

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao atualizar agendamento', error: err });
    res.status(200).json({ message: 'Atualizado com sucesso' });
  });
};

exports.deleteSchedule = (req, res) => {
  db.query('DELETE FROM agendamentos WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao deletar agendamento', error: err });
    res.status(200).json({ message: 'Deletado com sucesso' });
  });
};
