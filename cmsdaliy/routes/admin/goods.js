let express = require('express');
let router = express.Router();
let {checkedQuery,joinArr,joinObj} = require('../../utils/index');
let connection = require('../../config/db');
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//插入商品数据
router.post('/insertgoods',(req,res) => {
    let obj = req.body;
    if (checkedQuery(obj)) {
        let arr = Object.keys(obj);
        connection.query(`insert into goods (${joinArr(arr)}) values (${joinObj(obj)})`,(error,result) => {
            if (error) {throw error};
            if (result.affectedRows === 1) {
                res.json({code:0,msg:'商品插入成功！'});
            }
            else {
                res.json({code:1,msg:'商品插入失败！'});
            }
        })
    }
    else {
        res.json({code:2,msg:'数据上传不完整！'});
    }

});
//查看商品数据
router.get('/querygoods',(req,res) => {
    let obj = req.query;
    let currentpage = req.query.currentpage;
    let size = req.query.size;
    delete obj.currentpage;
    delete obj.size;
    let wherestr = '';
    for (let i in obj) {
        if (obj[i] === "") {
            delete obj[i];
        }
    }
    let objarr = Object.keys(obj);
    if (objarr.length) {
        wherestr = "where "
        for (let i in obj) {
            wherestr += `${i}='${obj[i]}' and`
        }
        wherestr = wherestr.slice(0,-3);
    }
    connection.query(`select * from goodsview order by gid asc ${wherestr}`,(error,result) => {
        if (error) {throw error}
        let data = result.slice((currentpage-1)*size,currentpage*size);
        let total = result.length;
        res.json({data,total});
    })
});
//删除栏目
router.get('/deletegoods',(req,res) => {
    let gid = req.query.gid;
    connection.query('select * from goods where gid=?',[gid],(error,result) => {
        if (error) {throw error}
        let thumb = result[0].thumb;
        let banner = result[0].gbanner.split(',');
        connection.query('delete from goods where gid=?',[gid],(error,results) => {
            if (error) {throw error}
            if (results.affectedRows === 1) {
                res.json({code:0,msg:'栏目删除成功！',thumb,banner});
            }
            else {
                res.json({code:1,msg:'栏目删除失败！'});
            }
        })
    })
});
//查询指定数据
router.get('/querycurrentgoods/:gid',(req,res) => {
    let gid = req.params.gid;
    connection.query('select * from goodsview where gid=?',[gid],(error,result) => {
        if (error) {throw error}
        res.json(result[0]);
    })
});
//修改数据
router.post('/updatecurrentgoods',(req,res) => {
    let obj = req.body;
    let gid = obj.gid;
    let str = '';
    delete obj.gid;
    delete obj.cid;
    delete obj.pid;
    delete obj.cname;
    delete obj.cnames;
    delete obj.createtime;
    for (let i in obj) {
        str += `${i}='${obj[i]}',`;
    }
    str = str.slice(0,-1);
    connection.query(`update goods set ${str} where gid=${gid}`,(error,result) => {
        if (error) {throw error}
        if (result.affectedRows === 1) {
            res.json({code:0,msg:'栏目修改成功！'});
        }
        else {
            res.json({code:1,msg:'栏目修改失败！'});
        }
    })
});

module.exports = router;
