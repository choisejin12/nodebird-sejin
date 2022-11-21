const passport=require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');



module.exports = () => {
    //req.login메서드가 호출함
    passport.serializeUser((user,done) => { // 로그인 시 실행되는 메서드 . 첫 번쨰 매개변수로 사용자 정보 받아옴(req.login이 줌)
        done(null,user.id);  // 사용자의 아이디만  req.session에 저장
    });

    // 결국엔 serializeUser 메서드는 세션에 원하는 값을 저장!! 만 하는 것임

    //passport.session 미들웨어가 호출함
    passport.deserializeUser((id,done) => { // 매 요청 시 실행되는 메서드. 위 메서드에서 저장한 값(user.id)가 첫 번째 매개변수로 들어옴
        User.findOne({  // User모델 조회
            where : { id }, // 원하는 id만 ( 로그인한 아이디)
            include: [{
                model : User, //User객체에서
                attributes: ['id', 'nick'], // id,nick 을 포함하여
                as: 'Followers', // 별명이 followers인 것 포함 -> 팔로워도 갖고와라
            }, {
                model : User, //User객체에서
                attributes: ['id', 'nick'],// id,nick 을 포함하여
                as: 'Followings',// 별명이 Followings인 것 포함 -> 팔로잉도 갖고와라
            }],
        })
            .then(user => done(null,user)) // 위 정보를 req.user에 저장
            .catch(err => done(err));
    });

    // 결국엔 deserializeUser 메서드는 세션에 저장한 값(사용자아이디)을 통해 사용자 객체를 불러오는 것!
    local();
    kakao();
};