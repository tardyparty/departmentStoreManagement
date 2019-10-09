// requirements
var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "tardyparty",
    password: "451021",
    database: "bamazon",
});

// global variables
var products; 
var item;
var num;
var newQuantity;


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

        // save products as a global variable
        products = res;

        // display all items for sale
        for (var i = 0; i < res.length; i++) {
            var product = res[i];
            console.log("ID: " + product.item_id, "Product: " + product.product_name, "Price: " + product.price + "\n")
        }
    })

    // connection.end();

    // ask what they want to buy
    promptSale();
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

        // var total = res[0].price * num

        if (res[0].stock_quantity < num) {
            console.log("Sorry, we do not have enough " + res[0].product_name + " in stock.");
            connection.end();
        }
        else {
            console.log("Your total is $" + (res[0].price * num) + ". Thank you for your purchase.");

            // save new quantity
            newQuantity = res[0].stock_quantity - num;
            updateInventory();
            updateSales();
        }
    })

    // connection.end();
}


function updateInventory() {

    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, item]);
}

function updateSales() {
    console.log("this is for supervisor view. update sales for department.");
    connection.end();
}