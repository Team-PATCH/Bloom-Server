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

const User = require('./user.js');
const Market = require('./market.js');
const Product = require('./product.js');
const InterestProduct = require('./interest_product.js');
const InterestMarket = require('./interest_market.js');
const MarketImage = require('./market_image.js');
const ProductImage = require('./product_image.js');
const OperatingTime = require('./operating_time.js');

db.User = User;
db.Market = Market;
db.Product = Product;
db.InterestProduct = InterestProduct;
db.InterestMarket = InterestMarket;
db.MarketImage = MarketImage;
db.ProductImage = ProductImage;
db.OperatingTime = OperatingTime;

User.init(sequelize);
Market.init(sequelize);
Product.init(sequelize);
InterestProduct.init(sequelize);
InterestMarket.init(sequelize);
MarketImage.init(sequelize);
ProductImage.init(sequelize);
OperatingTime.init(sequelize);

User.associate(db);
Market.associate(db);
Product.associate(db);
InterestProduct.associate(db);
InterestMarket.associate(db);
MarketImage.associate(db);
ProductImage.associate(db);
OperatingTime.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
