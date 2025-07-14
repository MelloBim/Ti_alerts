const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const scheduleRoutes = require('./routes/scheduleRoutes');
const { initializeScheduler } = require('./controllers/scheduleController');
const loginRoutes = require('./routes/loginRoutes');

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/schedules', scheduleRoutes);
app.use('/api', loginRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  initializeScheduler();
});