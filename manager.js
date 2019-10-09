// requirements
var inquirer = require('inquirer');
var mysql = require('mysql');

// global variables
var item;
var num;

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


// display options to manager
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
                "\n" + "Item_id: | " + products.item_id,
                "| Product_name: | " + products.product_name, 
                "| Price: | $" + products.price, 
                "| Stock_Quantity: | " + products.stock_quantity + " |"
                );
        }
    })
}


// view items with low inventory (> 20 units)
function lowInventory() {

    connection.query("SELECT * FROM products", function(err, res) {

        if (err) throw err;

        var lowIventoryItems = [];

        for (var i = 0; i < res.length; i++) {

            if (res[i].stock_quantity < 20) {
                lowIventoryItems.push(res[i])
            }
        }

        console.log("\n" + "********** Low Inventory **********" + "\n");

        for (var i = 0; i < lowIventoryItems.length; i++) {

            var products = lowIventoryItems[i];

            console.log(
                "\n" + "Item_id: | " + products.item_id,
                "| Product_name: | " + products.product_name, 
                "| Price: | $" + products.price, 
                "| Stock_Quantity: | " + products.stock_quantity + " |"
                );
        }
    })
}


// add to inventory
function addInventory() {

    var newQuantity;

    // asks questions and saves answers
    inquirer.prompt([
        {
            type: "number",
            name: "item",
            message: "What is the ID of the item to add inventory to?",
        },
        {
            type: "number",
            name: "num",
            message: "How many units are you adding?",
        }
    ]).then( function(answers) {

        // save inputs as global variable
        item = answers.item;
        num = answers.num;

        connection.query("SELECT * FROM products WHERE item_id = ?", [item], function(err, res) {
            if (err) throw err;
    
            newQuantity = res[0].stock_quantity + num;
    
            console.log("newQuantity: " + newQuantity);
        })
    
        connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",
        [newQuantity, item],
        function(err) {
            if (err) throw err;
        });
    })
}


// add another product to database
function addProduct() {

    var name;
    var department;
    var price;
    var quantity;

    console.log("\n" + "********** Add Product **********" + "\n")

    inquirer.prompt([
        {
            name: "name",
            message: "Please enter product name: ",
        },
        {
            name: "department",
            message: "Please enter product department: ",
        },
        {
            name: "price",
            message: "Please enter the price: ",
        },
        {
            name: "quantity",
            message: "Please enter the quantity: ",
        }
    ]).then(function(answers) {

        name = answers.name;
        department = answers.department;
        price = answers.price;
        quantity = answers.quantity;

        connection.query("INSERT INTO products VALUES(NULL, ?, ?, ?, ?)",
        [name, department, price, quantity],
        function(err) {
            if (err) throw err;
        });

        console.log(name + " added to database.");
    });
}