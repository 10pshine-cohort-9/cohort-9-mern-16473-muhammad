const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const pinoHttp = require('pino-http');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const notesRoutes = require('./routes/notes.routes');
require('./models/note.model');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // your frontend's dev server
  credentials: true, // allows the browser to send/receive the httpOnly cookie
}));
app.use(express.json());
app.use(cookieParser());

// Logs every incoming HTTP request/response automatically
app.use(pinoHttp({ logger }));

app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// 404 handler for unmatched routes, then the global error handler —
// both must be registered AFTER all real routes
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();