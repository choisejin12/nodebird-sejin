const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

//로컬 로그인 전략
module.exports = () => {
    passport.use(new LocalStrategy({ // LocalStrategy 생성자의 첫 번째 인수에는 로컬 로그인의 설정
        usernameField : 'email', // 일치하는 라우터의 req.body 속성명을 넣는다 ex req.body.email로 요청이 들어오니가 사용자이름에는 이메일로 넣으면 댐 email
        passwordField : 'password', //동일 !!!!!!!!!!!!! 입력받은 이메일과 비밀번호임 !!!!!!!!!!!
    }, async (email, password, done) => { //LocalStrategy 생성자의 두 번째 인수에는 로컬로그인 전략 구현 
        // 첫 번째 인수에서 넣어준 email과 password가 async함수의 매개변수로 들어감 . done은 passport.authenticate의 콜백 함수
        try{
            const exUser = await User.findOne({where : {email}}); // email에 해당하는 사용자 찾기
            if(exUser){ //사용자가 존재한다면 
                const result = await bcrypt.compare(password, exUser.password); // bcrypt의 compare함수로 password와 찾은 user의 password와 비교한다
                if(result){ //일치한다면
                    done(null,exUser); //done함수 두번째 매개변수에 유저정보를 넣어준다 -> authenticate 함수로 이동
                }else{ //일치하지 않는다면
                    done(null, false, { message : '비밀번호가 일치하지 않습니다'}); // 오류메세지 보냄
                }
            }else{// 사용자가 존재하지않는다면
                done(null,false, {message : '가입되지 않은 회원입니다'}); //오류 메세지 보냄
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};