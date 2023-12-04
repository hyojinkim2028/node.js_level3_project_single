const Sequelize = require('sequelize');
const path = require('path');
const User = require('./user');
const Goods = require('./goods');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.js'))[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.Goods = Goods;

User.initiate(sequelize);
Goods.initiate(sequelize);

User.associate(db);
Goods.associate(db);

module.exports = db;


