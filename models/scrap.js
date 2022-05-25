const Sequelize = require('sequelize');

module.exports = class Scrap extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      subContent: {
        type: Sequelize.STRING(140),
        allowNull: true,
        defaultValue: '',
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Scrap',
      tableName: 'scraps',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Scrap.belongsTo(db.User);
  }
};