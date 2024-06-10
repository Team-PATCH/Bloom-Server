const Sequelize = require('sequelize');

class InterestProduct extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        interest_product_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'InterestProduct',
        tableName: 'interest_product',
      }
    );
  }

  static associate(db) {
    db.InterestProduct.belongsTo(db.Product, { foreignKey: 'product_id'});
    db.InterestProduct.belongsTo(db.User, { foreignKey: 'user_id'});
  }
}

module.exports = InterestProduct;
