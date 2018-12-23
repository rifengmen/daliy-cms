const mysql=require('mysql');
const connection=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'daliy',
    multipleStatements: true,
    port     :'3306'
});
connection.connect();
module.exports =connection;
