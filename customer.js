// requirements
var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "tardyparty",
    password: "451021",
    database: "bamazon",
});

// global variables`
var products; 
var item;
var num;
var newQuantity;
var total;
var currentSales;
var department;


// app logic
connection.connect(function(err) {
    if (err) throw err;
    
    // display items initilly
    showItems();
})


// displays all items for sale on startup
function showItems() {

    // query all products from bamazon database
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        var values = [];

        for (var i = 0; i < res.length; i++) {

            var thisValue = [
                res[i].item_id, 
                res[i].product_name, 
                res[i].department_name, 
                res[i].price
            ];

            values.push(thisValue);
        }

        console.table(["Item ID", "Product Name", "Department Name", "Price"], values);

        // ask what they want to buy
        promptSale();
    });
}


// asks customer what they would like to buy and makes sale
function promptSale() {

    // asks questions and saves answers
    inquirer.prompt([
        {
            type: "number",
            name: "saleID",
            message: "What is the ID of the item you would like to buy?",
        },
        {
            type: "number",
            name: "quantity",
            message: "How many would you like to buy?",
        }
    ]).then( function(answers) {

        // save inputs as global variable
        item = answers.saleID;
        num = answers.quantity;

        // check inventory to see if there is enough of the item for sale
        checkQuantity();
    })
}


// finds requested item from database
function checkQuantity() {

    connection.query("SELECT * FROM products WHERE item_id = ?", [item], function(err, res) {

        total = res[0].price * num;
        department = res[0].department_name;
        currentSales = res[0].products_sales;

        if (res[0].stock_quantity < num) {
            console.log("\nSorry, we do not have enough " + res[0].product_name + " in stock.\nPlease come again.\n");
            connection.end();
        }
        else {
            console.log("\nYour total is $" + total + ". Thank you for your purchase.\n");

            // save new quantity
            newQuantity = res[0].stock_quantity - num;
            updateInventory();
            updateSales();
        }
    })
}


// check if ther is enough in stock and update stock or deny
function updateInventory() {

    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, item]);
}


// add total of sale to product sales
function updateSales() {

    var totalSales = total + currentSales;

    // update products table
    connection.query(
        "UPDATE products SET products_sales = ? WHERE item_id = ?",
        [totalSales, item],
        function(err) {
            if (err) throw err;
        });

    // update department table
    connection.query(
        "UPDATE departments SET product_sales = ? WHERE department_name = ?",
        [totalSales, department],
        function(err) {
            if (err) throw err;
        });
        
    connection.end();
}