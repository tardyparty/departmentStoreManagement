// requirements
var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require('console.table');

// global variables
var item;
var num;
var newQuantity;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "tardyparty",
    password: "451021",
    database: "bamazon",
});

connection.connect(function (err) {
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
                "Add New Product",
                "Quit"
            ]
        }
    ]).then(function (answers) {

        // perform proper function based on response
        switch (answers.action) {
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
                break;

            case "Quit":
                quit();
        }
    })
}


function quit() {

    connection.end();
}


// view all products
function viewProducts() {

    console.log("\n***** Showing all Products in Inventory *****\n");

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var values = [];

        for (var i = 0; i < res.length; i++) {

            var thisValue = [
                res[i].item_id,
                res[i].product_name,
                res[i].department_name,
                res[i].price,
                res[i].stock_quantity
            ];

            values.push(thisValue);
        }

        console.table(["Item ID", "Product Name", "Department Name", "Price", "Stock Quantity"], values);

        showMenu();
    })
}


// view items with low inventory (> 20 units)
function lowInventory() {

    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        var lowInventoryItems = [];

        for (var i = 0; i < res.length; i++) {

            if (res[i].stock_quantity < 20) {

                var thisValue = [
                    res[i].item_id,
                    res[i].product_name,
                    res[i].department_name,
                    res[i].price,
                    res[i].stock_quantity
                ];

                lowInventoryItems.push(thisValue);
            }
        }

        console.log("\n" + "***** Inventory less than 20 units *****" + "\n");

        console.table([
            "Item ID",
            "Product Name",
            "Department Name",
            "Price", "Stock Quantity"
        ],
            lowInventoryItems
        );

        showMenu();
    })
}


// add to inventory
function addInventory() {

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
    ]).then(function (answers) {

        // save inputs as global variable
        item = answers.item;
        num = answers.num;

        connection.query("SELECT * FROM products WHERE item_id = ?", [item], function (err, res) {
            if (err) throw err;

            newQuantity = res[0].stock_quantity + num;

            console.log("newQuantity: " + newQuantity);

            connection.query(
                "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                [newQuantity, item],
                function (err) {
                    if (err) throw err;
                });
        });


        showMenu();
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
    ]).then(function (answers) {

        name = answers.name;
        department = answers.department;
        price = answers.price;
        quantity = answers.quantity;

        connection.query("INSERT INTO products SET ?",
            {
                item_id: null,
                product_name: name,
                department_name: department,
                price: price,
                stock_quantity: quantity
            },
            function (err) {
                if (err) throw err;

                console.log(name + " added to database.");

                showMenu();
            });
    });

}