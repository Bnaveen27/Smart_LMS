const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./models');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LMS Backend Service active with Sequelize ORM & MySQL', timestamp: new Date() });
});

app.use('/api', apiRoutes);

async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`[Server] LMS Multi-Tenant Backend running on http://localhost:${PORT}`);
  });
}

startServer();
