const Sequelize =require('sequelize');

module.exports = class Hashtag extends Sequelize.Model{
    static init(sequelize){ //config를 통해 데이터베이스 정보 담은 객체를 매개변수로 담겨져옴
        return super.init({
            title:{
                type:Sequelize.STRING(15),
                allowNull:false,
                unique:true,
            },
        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:'Hashtag',
            tableName:'Hashtags',
            paranoid:false,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.Hashtag.belongsToMany(db.Post,{through:'PostHashTag'}); // Post모델과 N:M관계 => belongsToMany, through옵션값으로 새로운 모델 이름 PostHashtag => postId , hashtagId 추가됨 
    }
}