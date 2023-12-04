const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        email: Sequelize.STRING,
        name: Sequelize.STRING,
        password: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true, // createdAt,updatedAt
        underscored: false,
        modelName: 'User',
        tableName: 'Users',
        paranoid: true, // deletedAt
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Goods); // 1 : n
  }
}

module.exports = User;
