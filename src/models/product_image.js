const Sequelize = require('sequelize');

class ProductImage extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                product_image_id: {
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
                modelName: 'ProductImage',
                tableName: 'product_image',
            }
        );
    }

    static associate(db) {
        db.ProductImage.belongsTo(db.Product, { foreignKey: 'product_id' });
    }
}

module.exports = ProductImage;
