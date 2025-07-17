const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const scheduleRoutes = require('./routes/scheduleRoutes');
const loginRoutes = require('./routes/loginRoutes');
const { initializeScheduler } = require('./controllers/scheduleController');
const { connectionReady } = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/schedules', scheduleRoutes);
app.use('/api', loginRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  try {
    await connectionReady;
    initializeScheduler();
  } catch (err) {
    console.error('Erro ao iniciar agendador devido à conexão com o banco:', err);
  }
});
