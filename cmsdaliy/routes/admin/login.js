let express=require('express');
let router=express.Router();
let connection=require('../../config/db');
let bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.get('/',function (req,res) {
    res.send('loginget');
});
router.post('/',function (req,res) {
    // res.send('loginpost');
    let {username,password}=req.body;
    connection.query("select * from manage where username=? and password=?",[username,password],(error,result,field)=>{
        if(error){
            throw error;
        }
        if (result.length>0){
            res.json({code:0,msg:'登录成功'})
        } else{
            res.json({code:1,msg:'登录失败'})
        }
    });
});
module.exports=router;
