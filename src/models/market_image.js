const Sequelize = require('sequelize');

class MarketImage extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                market_image_id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                  },
                name: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                    unique: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                paranoid: true,
                modelName: 'MarketImage',
                tableName: 'market_image',
            }
        );
    }

    static associate(db) {
        db.MarketImage.belongsTo(db.Market, { foreignKey: 'market_id' });
    }
}

module.exports = MarketImage;
