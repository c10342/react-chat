const mysql=require('mysql');

const mysqlConfig=require('../config/mysqlConfig.js')


// 返回数据库连接对象
function mysqlConnection(){
    return mysql.createConnection(mysqlConfig.mysqlConfig);
}

module.exports={
    mysqlConnection
}

