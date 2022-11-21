const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];


const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db={};
const sequelize = new Sequelize(config.database, config.username, config.password, config); //데이터베이스 셋팅

//db객체에 데이터베이스 넣기
db.sequelize =sequelize;

db.User=User;
db.Post=Post;
db.Hashtag=Hashtag;


//init메서드 호출 => 각 모델의 static.init 메서드 호출 
User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

//associate메서드 호출 => 각 모델의 static.associate 메서드 호출 
User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports=db;