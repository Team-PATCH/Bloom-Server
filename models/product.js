const Sequelize = require('sequelize');

class Product extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                product_id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                  },
                name: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                category: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                },
                color: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                },
                price: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                description_image: {
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
                caution: {
                    type: Sequelize.STRING(200),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                paranoid: true,
                modelName: 'Product',
                tableName: 'product',
            }
        );
    }

    static associate(db) {
        db.Product.belongsTo(db.Market, { foreignKey: 'market_id' });
        db.Product.hasMany(db.InterestProduct, { foreignKey: 'product_id' });
        db.Product.hasMany(db.ProductImage, { foreignKey: 'product_id' });
    }
}

module.exports = Product;
