const Sequelize = require('sequelize');

class Market extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                market_id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                summary: {
                    type: Sequelize.STRING(30),
                    allowNull: false,
                },
                address_detail: {
                    type: Sequelize.STRING(30),
                    allowNull: false,
                },
                location: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                phone_number: {
                    type: Sequelize.STRING(15),
                    allowNull: false,
                },
                sns: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },
                share: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },
                interest_count: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                coordinate_logitude: {
                    type: Sequelize.DOUBLE,
                    allowNull: false,
                },
                coordinate_latitude: {
                    type: Sequelize.DOUBLE,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                paranoid: true,
                modelName: 'Market',
                tableName: 'market',
            }
        );
    }

    static associate(db) {
        db.Market.hasMany(db.Product, { foreignKey: 'market_id'});
        db.Market.hasMany(db.InterestMarket, { foreignKey: 'market_id'});
        db.Market.hasMany(db.OperatingTime, { foreignKey: 'market_id'});
        db.Market.hasMany(db.MarketImage, { foreignKey: 'market_id'});
    }
}

module.exports = Market;
