let express = require('express');
let router = express.Router();
let goods = require('./index/goods');
let login = require('./index/login');
let orders = require('./index/orders');
let users = require('./index/users');

router.use('/goods',goods);
router.use('/login',login);
router.use('/orders',orders);
router.use('/users',users);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
