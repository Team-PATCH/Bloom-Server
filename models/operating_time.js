const Sequelize = require('sequelize');

class OperatingTime extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                operating_time_id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                  },
                day: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                    unique: false,
                },
                operating_time: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                paranoid: true,
                modelName: 'OperatingTime',
                tableName: 'operating_time',
            }
        );
    }

    static associate(db) {
        db.OperatingTime.belongsTo(db.Market, { foreignKey: 'market_id' });
    }
}

module.exports = OperatingTime;
