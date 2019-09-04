let express = require('express');
let router = express.Router();
let login=require('./admin/login');
let webinfo=require('./admin/webinfo');
let userinfo=require('./admin/userinfo');
let cate = require('./admin/cate');
let goods = require('./admin/goods');

router.use('/login',login);
router.use('/webinfo',webinfo);
router.use('/userinfo',userinfo);
router.use('/cate',cate);
router.use('/goods',goods);

module.exports = router;
