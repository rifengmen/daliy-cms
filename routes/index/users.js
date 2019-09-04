let express = require('express');
let router = express.Router();
let connection = require('../../config/db');
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


router.post('/query',(req,res) =>{
    let uid = req.body.uid;
    connection.query('select * from users where uid=?',[uid],(error,result) => {
        if (error) throw error;
        res.json(result);
    })
});


module.exports = router;
