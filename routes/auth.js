const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedIn , isNotLoggedIn} = require('./middlewares');
const User = require('../models/user');

const router = express.Router();


router.post('/join', isNotLoggedIn , async(req,res,next) => { // 회원가입 라우터 실제경로는 /auth/join임 isNotLoggedIn 미들웨어 이용해서 로그인안한상태만 접근하도록 함
    const {email , nick , password} = req.body; // req.bodt.email 과 같은 의미.. 객체 불러오기 
    try{
        const exUser = await User.findOne({where : {email}}); // 해당하는 email을 User모델에서 찾아서 저장
        if(exUser){ //해당하는 유저가 있다면 
            return res.redirect('/join?error=exist'); //에러를 보내
        }//유저가 업슨경우에는
        const hash = await bcrypt.hash(password,12); //bcrypt의 hash함수로 입력한 패스워드를 암호화하여 저장
        await User.create({ //User모델에 유저정보 생성
            email,
            nick,
            password:hash, //비밀번호는 암호화하여
        });
        return res.redirect('/'); //메인페이지로 리다이렉트
    }catch(error){
        console.error(error);
        return next(error);
    }
 });

 router.post('/login', isNotLoggedIn , (req,res,next) => { // 로그인 라우터 실제경로는 /auth/login임 isNotLoggedIn 미들웨어 이용해서 로그인안한상태만 접근하도록 함
    passport.authenticate('local', (authError, user, info) => { //passport에 내장되어있는 authenticate메서드를 호출하여 local 로그인 전략을 실행해준다
        // local 로그인 전략 실행 / 성공한다면  요user에 인수가 담김 ( 로그인할 사용자 정보) / authError에 값이 있다면 실패함
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`); //info객채에 오류메세지가 담겨져옴
        }
        return req.login(user, (loginError) => { // passport는 req객체에 login메서드를 추가함. login 메서드는 serializeUser메서드를 호출함 (인수로 user줌)
            //그럼 serializeUser 메서드에서 사용자 아이디만 세션에 저장해뒀음 . 사용자가 요청시에는 deserializeUser메서드를 호출하여 req.user을 만듬
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res,next) // 미들웨어 내의 미들웨어에는 붙인다
 });

 router.get('/logout',isLoggedIn,(req,res) => { // 로그아웃 라우터 실제경로는 /auth/logout임 isLoggedIn 미들웨어 이용해서 로그인한상태만 접근하도록 함
    req.logout(); //passport는 req객체에 logout메서드를 추가함 , req.user 삭제
    req.session.destroy(); //session 제거 , res.session내용 제거
    res.redirect('/');
 });

 router.get('/kakao', passport.authenticate('kakao')); // 카카오 전략을 수행함. (제일 처음에는 이걸)

 //위에 라우터하고나서는 카카오전략생성자에서 설정한 콜백url로 정보객체 받아서 다시 authenticate 메서드 실행함
 router.get('/kakao/callback', passport.authenticate('kakao', { // 카카오 인증후에는 해당 주소가 되어짐. 카카오는 자체적으로 req.login을 호출하기때문에 내가 안해도댐!
    failureRedirect: '/',
 }), (req, res) => {
    res.redirect('/');
 });

 module.exports = router;