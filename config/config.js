const dotenv = require('dotenv');
dotenv.config();

const development = {
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: 'spa-mall',
  host: process.env.SQL_HOST,
  dialect: 'mysql',
};

const test = {
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: 'database_test',
  host: process.env.SQL_HOST,
  dialect: 'mysql',
};

const production = {
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: 'database_production',
  host: process.env.SQL_HOST,
  dialect: 'mysql',
};

module.exports = { development };
