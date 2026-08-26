const { connectDB, sequelize } = require('./config/db');
const logger = require('./utils/logger');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const REQUIRED_ENV_VARS = ['FRONTEND_URL', 'JWT_SECRET', 'COOKIE_NAME'];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  logger.error(
    { missingEnvVars },
    'Refusing to start: required environment variables are not set.'
  );
  process.exit(1);
}

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