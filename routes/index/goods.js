let express = require('express');
let router = express.Router();
let connection = require('../../config/db');

//获取主页商品列表
router.get('/querygoods/:pid/:currentpage',(req,res) => {
    let {pid,currentpage} = req.params;
    connection.query('select * from goodsview where pid=?',[pid],(error,result) => {
        if (error) {throw error}
        let page = 5;
        let start = (currentpage - 1) * page;
        let end = currentpage * page;
        let total = Math.ceil(result.length / page);
        let data = result.slice(start,end);
        if (result.length) {
            res.json({
                code:0,
                msg:'success',
                total,
                data,
            });
        }
        else {
            res.json({
                code:1,
                meg:'fail'
            })
        }

    })
});
// 获取商品详情
router.get('/goodsinfo',(req,res) => {
    let {gid,cid1} = req.query;
    let goodsinfo = {};
    let recommendgoods = [];
    connection.query('select * from goodsview where cid1=? and gid!=? order by gid asc limit 0,5;select * from goodsview where gid=?',[cid1,gid,gid],(error,result) => {
        if (error) throw error;
        if (result[1].length) {
            goodsinfo = result[1][0];
            if (result[0].length) {
                recommendgoods = result[0];
                res.json({
                    code: 0,
                    msg: '商品数据获取成功！',
                    goodsinfo,
                    recommendgoods
                })
            }
            else {
                res.json({
                    code: 2,
                    msg: '没有相关商品！',
                    goodsinfo,
                    recommendgoods
                })
            }
        }
        else {
            res.json({
                code: 1,
                msg: '商品数据获取失败！'
            })
        }
    })
});
//获取二级列表以及对应商品的方法
router.get('/goodslist',(req,res) => {
    let cid = req.query.cid;
     connection.query('select * from category where pid = ?;select * from goodsview where cid1 = ?',[cid,cid],(error,result) => {
         if (error) throw error;
         let goods = [];
         goods = result[0];
         goods.forEach(ele => {
             ele['goods'] = result[1].filter(goods => goods.cid2 === ele.cid)
         });
         res.json(goods);
     })
});
//获取推荐商品
router.get('/recommendgoods',(req,res) => {
    let gidstr = req.query.str;
    connection.query(`select * from goodsview where gid not in (${gidstr}) order by gid asc limit 12,4`,(error,result) => {
        if (error) throw error;
        res.json(result);
    });
});


module.exports = router;
