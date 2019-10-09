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
    
    showMenu();
})


function showMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Please select from the options below: ",
            choices: [
                "View Products",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }
    ]).then(function(answers) {

        // perform proper function based on response
        switch(answers.action) {
            case "View Products":
                viewProducts();
                break;
            
            case "View Low Inventory": 
                lowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
        }
    })
}


// view all products
function viewProducts() {

    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {

            var products = res[i];

            console.log(
                "\n" + "Item_id: " + products.item_id,
                "Product_name: " + products.product_name, 
                "Product_Price: " + products.product_price, 
                "Stock_Quantity: " + products.stock_quantity
                );
        }
    })
}


// view items with low inventory (> 20 units)
function lowInventory() {


}