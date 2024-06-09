const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nick: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        email: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'User',
        tableName: 'user',
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.InterestProduct, { foreignKey: 'user_id'});
  }
}

module.exports = User;
