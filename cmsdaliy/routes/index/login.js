let express = require('express');
let router = express.Router();
let connection = require('../../config/db');
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended:false }));
router.use(bodyParser.json());

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

module.exports = router;
