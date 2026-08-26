const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const pinoHttp = require('pino-http');
const authRoutes = require('./routes/auth.routes');
const notesRoutes = require('./routes/notes.routes');
require('./models/note.model');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();
app.disable('x-powered-by');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(pinoHttp({ logger }));

app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;