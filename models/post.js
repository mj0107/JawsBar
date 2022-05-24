const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
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
      likeCounts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    // Post:User = N:1
    // user.js에선 user.hasMany(db.Post); 해주어야 함
    db.Post.belongsTo(db.User);
    // Post:Hashtag = N:M
    // PostHashtag 테이블을 통해 관리
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });

    db.Post.belongsToMany(db.User, {
      foreignKey:'PostId',
      as:'Likers',
      through: 'likes',
    });
  }
};
