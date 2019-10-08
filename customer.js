var inquirer = require('inquirer');
var mysql = require('mysql');



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "tardyparty",
    password: "451021",
    database: "bamazon",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
})
