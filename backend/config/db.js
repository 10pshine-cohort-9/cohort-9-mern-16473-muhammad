const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
  }
);
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
  } catch (err) {
    console.error('Unable to connect to MySQL:', err.message);
    throw err; // let the caller decide what to do — don't swallow it
  }
};

module.exports = { sequelize, connectDB };
