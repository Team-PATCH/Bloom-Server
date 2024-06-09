const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
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

//   static associate(db) {
//     db.User.hasMany(db.Sale, { foreignKey: 'userID', sourceKey: 'id' });
//   }
}

module.exports = User;
