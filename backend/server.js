const express = require('express');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

app.use('/api/auth', authRoutes);

const startServer = async () => {
  await connectDB();
  await sequelize.sync(); // creates the users table if it doesn't exist yet
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();