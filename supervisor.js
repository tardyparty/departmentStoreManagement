var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require('console.table');



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "tardyparty",
    password: "451021",
    database: "bamazon",
});

connection.connect(function(err) {
    if (err) throw err;
    
    menu();
})

function menu() {

    inquirer
        .prompt([
            {
                type: "list",
                name: "input",
                message: "Please Select: ",
                choices: [
                    "View Sales by Department", 
                    "Create New Department",
                "Quit"
                ]
            }
        ])
        .then(function(answers) {

            switch(answers.input) {

                case "View Sales by Department":
                    viewSales();
                    break

                case "Create New Department":
                    newDepartment();
                    break

                case "Quit":
                    quit();

            }
        }) 
}


function quit() {
    connection.end();
}


function viewSales() {

}


function newDepartment() {

}