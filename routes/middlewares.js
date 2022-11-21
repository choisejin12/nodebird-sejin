exports.isLoggedIn = (req,res,next) => { // 로그인할 경우 미들웨어
    if( req.isAuthenticated()){ // passport 모듈은 req객체에 isAuthenticated메서드를 추가한다
        next(); // isAuthenticated가 참 = 로그인한 상태. next()호출해서 다음 미들웨어 진행해라.
    }else{
        res.status(403).send('로그인필요'); //로그인해라 fasle니꼐
    }
};

exports.isNotLoggedIn = (req,res,next) => { //로그인 안한 상태의 미들웨어
    if(!req.isAuthenticated()){ // isAuthenticated가 참이 아니라면 = 로그인 안했음
        next();//로그인 안했으니 넘어가라. 
    }else{
        const message = encodeURIComponent('로그인한 상태입니다');//로그인했음
        res.redirect(`/?error=${message}`);//메세지 띄워
    }
};