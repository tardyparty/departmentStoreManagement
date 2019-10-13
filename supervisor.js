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

// show options menu
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


// quit - end db connection
function quit() {
    connection.end();
}


// view sales of each department
function viewSales() {

    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;

        var values = [];

        for(var i=0; i<res.length; i++){

            var totalSales = res[i].product_sales - res[i].over_head_costs;

            var thisValue = [
                res[i].department_id,
                res[i].department_name,
                res[i].over_head_costs,
                res[i].product_sales,
                totalSales
            ];

            values.push(thisValue);
        }

        console.log("\n")
        console.table(["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Net Income"], values);
        
        menu();
    })
}


// add a new department to departments table
function newDepartment() {

        var name;
        var overhead;
    
        console.log("\n" + "********** Add Department **********" + "\n")
    
        inquirer.prompt([
            {
                name: "name",
                message: "New Department Name: ",
            },
            {
                type: "number",
                name: "overhead",
                message: "Overhead Costs: ",
            }
        ]).then(function (answers) {
    
            name = answers.name;
            overhead = answers.overhead;
    
            connection.query("INSERT INTO departments SET ?",
                {
                    department_id: null,
                    department_name: name,
                    over_head_costs: overhead,
                    product_sales: 0
                },
                function (err) {
                    if (err) throw err;
    
                    console.log(name + " added to database.");
    
                    menu();
                });
        });
}