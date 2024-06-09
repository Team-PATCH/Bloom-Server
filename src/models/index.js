const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db = {};
let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require('./user');
const Market = require('./market');
const Product = require('./product');

db.User = User;
db.Market = Market;
db.Product = Product;

User.init(sequelize);
Market.init(sequelize);
Product.init(sequelize);

// User.associate(db);
Market.associate(db);
Product.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
