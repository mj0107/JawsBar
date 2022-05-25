const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');
const Scrap = require('./scrap');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.Scrap = Scrap;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Scrap.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Scrap.associate(db);

module.exports = db;
