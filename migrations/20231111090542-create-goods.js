'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Goods', {
      goods: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM(['FOR-SALE', 'SOLD-OUT']),
        defaultValue: 'FOR-SALE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Goods');
  },
};
