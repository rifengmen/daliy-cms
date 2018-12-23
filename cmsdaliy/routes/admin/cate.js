let express = require('express');
let router = express.Router();
let connection = require('../../config/db');
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//获取所有数据
router.get('/querycate',(req,res) => {
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
        wherestr = "where";
        for (let i in obj) {
            wherestr += ` ${i}='${obj[i]}' and`
        }
        wherestr = wherestr.slice(0,-3);
    }
    connection.query(`select * from category ${wherestr} order by cid asc`,(error,result) => {
        if (error) {throw error}
        let data = result.slice((currentpage-1)*size,currentpage*size);
        let total = result.length;
        res.json({data,total});
    });
});
//获取一级标题
router.get('/querylevelcate',(req,res) => {
    connection.query('select * from category where pid=0 order by cid asc',(error,result) => {
        if (error) {throw error}
        res.json(result);
    });
});
//获取二级标题
router.get('/querylevel2cate',(req,res) => {
    let cid = req.query.cid;
    connection.query('select * from category where pid=? order by cid asc',[cid],(error,result) => {
        if (error) {throw error}
        res.json(result);
    });
});
//插入栏目
router.post('/insertcate',(req,res) => {
    let {cname,pid} = req.body;
    connection.query('insert into category (cname,pid) values (?,?)',[cname,pid],(error,result) => {
        if (error) {throw error}
        if (result.affectedRows === 1) {
            res.json({code: 0 , msg: '栏目插入成功！'});
        }
        else {
            res.json({code: 1 , msg: '栏目插入失败！'});
        }
    });
});
//删除栏目
router.get('/deletecate',(req,res) => {
    let cid = req.query.cid;
    connection.query('select * from category where pid=?',[cid],(error,result) => {
        if (error) {throw error}
        if (!result.length) {
            connection.query('delete from category where cid=?',[cid],(error,result) => {
                if (error) {throw error}
                if (result.affectedRows === 1) {
                    res.json({code:0,msg:'栏目删除成功！'});
                }
                else {
                    res.json({code:1,msg:'栏目删除失败！'});
                }
            })
        }
        else {
            res.json({code:2,msg:'包含子分类，无法删除！'});
        }
    })
});
//查询指定数据
router.get('/querycurrentcate/:cid',(req,res) => {
    let cid = req.params.cid;
    connection.query('select * from category where cid=?',[cid],(error,result) => {
        if (error) {throw error}
        res.json(result[0]);
    })
});
//修改数据
router.post('/updatecurrentcate',(req,res) => {
    let {cid,cname,pid} = req.body;
    connection.query('update category set cname=?,pid=? where cid=?',[cname,pid,cid],(error,result) => {
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
