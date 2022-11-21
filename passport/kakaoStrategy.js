const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

//카카오 로그인 전략
module.exports = () => {
    passport.use(new kakaoStrategy({ // kakaoStrategy 생성자 , 첫 번째 인수에는 카카오 로그인 설정
        clientID : process.env.KAKAO_ID, // .env 파일에 저장해둔 클라이언트 아이디
        callbackURL : '/auth/kakao/callback', // 카카오는 인증 후 이 주소로 accessToken과 refreshToken과 profile을 보낸다
    }, async (accessToken, refreshToken, profile, done)=> { // 두 번째 인수에는 실제 전략을 구현
        console.log('kakao profile', profile); // profile에는 사용자 정보가 들어있다
        try{
            const exUser = await User.findOne({ //User모델 조회
                where: { snsId : profile.id, provider: 'kakao'}, // 
            });
            if(exUser){ // 사용자가 존재한다면 -> 로그인시켜
                done(null, exUser); //done함수를 호출한다 done함수는 passport.authenticate의 콜백 함수 . 첫 번째 인수에는 오류를 , 두 번째 인수에는 사용자를 넣는다 ->  passport.authenticate메서드로 보냄
            }else{
                const newUser = await User.create({ // 사용자가 존재하지 않는다면 -> 회원가입시켜
                    email : profile._json && profile._json.kakao_account_email,
                    nick : profile.displayName,
                    snsId : profile.id,
                    provider : 'kakao',
                });
                done(null, newUser); ////done함수를 호출한다 done함수는 passport.authenticate의 콜백 함수 . 첫 번째 인수에는 오류를 , 두 번째 인수에는 사용자를 넣는다 ->  passport.authenticate메서드로 보냄
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};
