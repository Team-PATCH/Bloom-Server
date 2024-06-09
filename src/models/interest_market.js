const Sequelize = require('sequelize');

class InterestMarket extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        interest_market_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'InterestMarket',
        tableName: 'interest_market',
      }
    );
  }

  static associate(db) {
    db.InterestMarket.belongsTo(db.Market, { foreignKey: 'market_id'});
    db.InterestMarket.belongsTo(db.User, { foreignKey: 'user_id'});
  }
}

module.exports = InterestMarket;
