let express = require('express');
let router = express.Router();
let connection = require('../../config/db');
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:false }));
router.use(bodyParser.json());
let request = require("request");

//用户登录
router.post('/',(req,res) => {
    let {phone,password} = req.body;
    connection.query('select * from users where phone = ?;select * from users where phone = ? and password = ?',[phone,phone,password],(error,result) => {
        if(error) throw error;
        if (!result[0].length) {
            res.json({code: 2, msg: '用户不存在！'});
        }
        else if (result[0].length && !result[1].length) {
            res.json({code: 1, msg: '用户密码错误！'});
        }
        else if (result[0].length && result[1].length) {
            res.json({code: 0, msg: '登录成功！', uid:result[1][0].uid});
        }
    });
});
//用户注册
router.post('/registe',(req,res) => {
    let {phone,password} = req.body;
    let nickname = "小优" + Date.now();
    connection.query('insert into users (phone,password,nickname) values (?,?,?)',[phone,password,nickname],(error,result) => {
        if (error) throw error;
        if (result.affectedRows === 1) {
            res.json({code: 0, msg: '注册成功！'})
        }
        else {
            res.json({code: 0, msg: '注册失败！'})
        }
    });
});
//微信登录
router.get('/login',(req,res) => {
    let code = req.query.code;
    let userinfo = JSON.parse(req.query.userinfo);
    let nickname = userinfo.nickName;
    let thumb = userinfo.avatarUrl;
    let appid = 'wx0dcf9cd51d58e734';
    let secret = '8beeb6d0e544e4b0499af336f69d8f47';
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    request(url,(error, response, body) => {
        let data = JSON.parse(body);
        let openid = data.openid;
        let sql = `insert into users (nickname,phone,password,thumb,openid) values ('${nickname}','18735605086','a123456','${thumb}','${openid}')`;
        console.log(sql);
        connection.query(sql,(error,result) => {
            if (error) throw error;
            if (result.affectedRows === 1) {
                res.json({
                    code:0,
                    msg:"success",
                    openid:openid
                })
            }
            else {
                res.json({
                    code:1,
                    msg:"fail"
                })
            }
        });
    })
});

module.exports = router;
