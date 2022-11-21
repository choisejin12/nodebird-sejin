const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');
const { describe } = require('../models/user');

beforeAll(async() => {
    await sequelize.sync();
});



describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email:'www_zq@naver.com',
                nick:'segin',
                password:'rewq8529',
            })
            .expect('Location','/')
            .expect(302,done);
    });
});

describe('POST /join', () => {
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email:'www_zq@naver.com',
                password:'rewq8529',
            })
            .end(done);
    });

    test('이미 로그인 했다면 redirect /', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다')
        agent
            .post('/auth/join')
            .send({
                email:'www_zq@naver.com',
                nick:'segin',
                password:'rewq8529',
            })
            .expect('Location',`/?error=${message}`)
            .expect(302,done);
    });
});

describe('POST /login', ()=>{
    test('가입되지않은 회원입니다', async(done) => {
        const message = encodeURIComponent('가입되지않은 회원입니다');
        request(app)
            .post('/auth/login')
            .send({
                email:'www_zq@naver.com',
                password:'rewq8529',
            })
            .expect('Location',`/?error=${message}`)
            .expect(302,done);
    });

    test('로그인수행', async(done) => {
        request(app)
            .post('/auth/login')
            .send({
                email:'www_zq@naver.com',
                password:'rewq8529',
            })
            .expect('Location','/')
            .expect(302,done);
    });

    test('비밀번호틀림', async(done) => {
        const message = encodeURIComponent('비밀번호가일치하지않습니다');
        request(app)
            .post('/auth/login')
            .send({
                email:'www_zq@naver.com',
                password:'wrong',
            })
            .expect('Location',`/?error=${message}`)
            .expect(302,done);
    });
});


describe('GET /logout', ()=>{
    test('로그인되어있지 않으면 403', async(done) => {
        const message = encodeURIComponent('가입되지않은 회원입니다');
        request(app)
            .get('/auth/logout')
            .expect(403,done);
    });
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email:'www_zq@naver.com',
                password:'rewq8529',
            })
            .end(done);
    });

    test('로그아웃 수행', async(done) => {
        const message = encodeURIComponent('비밀번호가일치하지않습니다');
        agent
            .get('/auth/logout')
            .expect('Location','/')
            .expect(302,done);
    });
});


afterAll(async() => {
    await sequelize.sync({force:true});
});


