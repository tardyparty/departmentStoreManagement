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
    
    // display items initilly
    showItems();
})


// displays all items for sale on startup
function showItems() {

    // query all products from bamazon database
    connection.query("SELECT * FROM products", function(err, res) {

        if (err) throw err;

        // display all items for sale
        for (var i = 0; i < res.length; i++) {
            var product = res[i];
            console.log("ID: " + product.item_id, "Product: " + product.product_name, "Price: " + product.price + "\n")
        }
    })
}