const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'wpr',
    database:'wpr2023',
    password: 'fit2023',
    port:3306
    });
    connection.connect((err) => {
        if(err){
          console.log('Error connecting to Db');
          return;
        }
        console.log('Connection established after creating table');
      });
module.exports = connection;