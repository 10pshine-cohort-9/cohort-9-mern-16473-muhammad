const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

app.use('/api/auth', authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1); // fail fast instead of limping along broken
  }
};

startServer();