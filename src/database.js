const mysql = require('mysql')

const mysqlConnection= mysql.createConnection(
    {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: 'a3b0Cr2zw',
        database: 'storecode'
    }
)


mysqlConnection.connect(function(err){
    if(err){
        console.log(err);
        return
    }else{
        console.log('La base de datos esta conectada')
    }
})

module.exports = mysqlConnection;