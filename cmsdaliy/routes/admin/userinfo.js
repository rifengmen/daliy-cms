let express=require('express');
let router=express.Router();
let connection = require('../../config/db');
let bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.get('/:username',function (req, res) {
    let username = req.params.username;
    connection.query('select * from manage where username=?',[username],(error,result) => {
        if (error) {throw error};
        res.json(result);
    })
});
router.post('/',function (req, res) {
    let password = req.body.password;
    let username = req.body.username;
    connection.query('update manage set password=? where username=?',[password,username],(error,result) => {
        if (error) {throw error};
        if (result.affectedRows === 1) {
            res.json({code:0,msg:"密码修改成功！"});
        }
        else {
            res.json({code:1,msg:"密码修改失败！"});
        }
    })
})

module.exports = router;
