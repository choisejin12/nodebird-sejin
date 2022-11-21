const Sequelize = require('sequelize');

module.exports= class User extends Sequelize.Model{
    static init(sequelize){ //config를 통해 데이터베이스 정보 담은 객체를 매개변수로 담겨져옴
        return super.init({
            email:{
                type:Sequelize.STRING(40),
                allowNull:true,
                unique:true,
            },
            nick:{
                type:Sequelize.STRING(15),
                allowNull:false,
            },
            password:{
                type:Sequelize.STRING(100),
                allowNull:true,
            },
            provider:{
                type:Sequelize.STRING(10),
                allowNull:false,
                defaultValue:'local', // local로그인이 기본값. 카카오로그인이면 kakao로 변경?!?!?
            },
            snsId:{ //sns로그인일때
                type:Sequelize.STRING(100),
                allowNull:true,
            },
        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:'User',
            tableName:'users',
            paranoid:true,
            charset:'utf8',
            collate:'utf8_general_ci',
        });
    }

    static associate(db){
        db.User.hasMany(db.Post); // Post모델과 1:N 관계 (User가 1) => hasMany 메서드 사용 
        db.User.belongsToMany(db.User,{ // 자신과 N:M 관계 => belongsToMany 메서드 사용 
            foreignKey : 'followingId', //foreignKey 옵션값으로 followingId 을 넣어서 Follow모델에 followingId추가 (id는 1부터 자동생성되는듯함)
            as: 'Followers', // as옵션을 사용하여 관계맺을때 addFollowers , getFollowers 등 메서드를 이용하게끔 함 => foreignKey과 반대값으로 사용
            through: 'Follow', // through옵션값으로 새로운 모델 Follow 생성
        });
        db.User.belongsToMany(db.User,{ //위와 동일
            foreignKey : 'followerId',
            as: 'Followings',
            through: 'Follow',
        })
    }
};