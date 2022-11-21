const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model{
    static init(sequelize){ //config를 통해 데이터베이스 정보 담은 객체를 매개변수로 담겨져옴
        return super.init({
            content:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            img:{
                type:Sequelize.STRING(100),
                allowNull:true,
            },
        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:'Post',
            tableName:'posts',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.Post.belongsTo(db.User); // User모델과 1:N 관계 (User가 1) => belongsTo 메서드 
        db.Post.belongsToMany(db.Hashtag,{through:'PostHashTag'}); // Hashtag 모델과 N:M관계 => belongsToMany메서드 사용 , through옵션값으로 새로운 모델 PostHashTag 생성 => postId , hashtagId 추가됨 
    }
};