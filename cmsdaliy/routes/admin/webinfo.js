let express=require('express');
let router=express.Router();
let connection = require('../../config/db');
let bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.get('/',function (req,res) {
    connection.query('select * from webinfo',(error,result) => {
        if (error) {throw error};
        res.json(result);
    })
});
router.post('/',function (req, res) {
    let str = '';
    for (let i in req.body) {
        let v = req.body[i];
        str += `${i}='${v}',`;
    }
    str = str.slice(0,-1);
    connection.query('update webinfo set ' + str,(error,result) => {
        if (error) {throw error};
        if (result.affectedRows === 1) {
            res.json({code:0,msg:"修改成功！"});
        }
        else {
            res.json({code:1,msg:"修改失败！"});
        }
    })
});
module.exports=router;
