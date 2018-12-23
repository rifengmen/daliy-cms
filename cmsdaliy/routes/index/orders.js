let express = require('express');
let router = express.Router();
let connection = require('../../config/db');
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
//创建订单
router.post('/insert',(req,res) => {
    let {uid , discount , price , count , goods} = req.body;
    connection.query('insert into orders (uid,discount,price,count) values (?,?,?,?)',[uid , discount , price , count],(error,result) => {
        if (error) throw error;
        if (result.affectedRows === 1) {
            let oid = result.insertId;
            let goodslist = goods.map(ele => { return '('+[ele.gid,ele.numbers,oid].join()+')'});
            let str = goodslist.join();
            connection.query(`insert into ordersextra (gid,numbers,oid) values ${str}`,(error,result) => {
                if (error) throw error
                if (result.affectedRows >= 1) {
                    res.json({code: 0, msg: '订单创建成功！', oid: oid})
                }
                else {
                    res.json({code: 2, msg: '订单商品插入失败！'})
                }
            })
        }
        else {
            res.json({code: 2, msg: '订单创建失败！'})
        }
    });
});
//查询订单详情
router.get('/query',(req,res) => {
    let {uid , oid} = req.query;
    connection.query('select * from orders where oid=? and uid=?;select goods.* from goods,ordersextra where goods.gid=ordersextra.gid and ordersextra.oid=?',[oid,uid,oid],(error,result) => {
        if (error) throw error;
        if (result[0].length && result[1].length) {
            res.json({
                code: 0,
                msg: "success",
                goods:result[1],
                orders:result[0][0]
            })
        }
        else {
            res.json({
                code: 1,
                msg: "fail",
            })
        }
    })
});
//支付，修改订单状态
router.get("/pay",(req,res) =>{
    let oid = req.query.oid;
    connection.query('update orders set status=1 where oid=?',[oid],(error,result) =>{
        if (error) throw error;
        if (result.affectedRows === 1) {
            res.json({code: 0, msg: '支付成功！'})
        }
        else {
            res.json({code: 1, msg: '支付失败！'})
        }
    })
});
//查询用户全部订单
router.get('/queryall',(req,res) => {
    let uid = req.query.uid;
    connection.query('select * from orders where uid = ?;select goods.*,orders.oid from goods,orders,ordersextra where ordersextra.gid = goods.gid and ordersextra.oid = orders.oid and orders.uid = ?',[uid,uid],(error,result) => {
        if (error) throw error;
        if (result[0].length) {
            let orders = result[0];
            orders.forEach(ele => {
                ele.goods = result[1].filter(goods => goods.oid == ele.oid)
            });
            res.json({code: 0,msg: 'success',orders: orders})
        }
        else {
            res.json({code: 1,msg: 'fail'})
        }
    })
});



module.exports = router;
