var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    enterStore();
});

function enterStore() {
    inquirer
        .prompt({
            name: "add",
            type: "rawlist",
            message: "Welcome to the BAMAZON manager command center",
            choices: ["ENTER", "EXIT"]
        })
        .then(function (answer) {
            if (answer.add.toUpperCase() === "ENTER") {
                chooseOption();
            }

        });
}

function chooseOption() {
    inquirer
        .prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: ["View Products For Sale", "View Low Inventory", "Restock Products", "Add New Product", "Return to Home"],
                message: "Choose from the options below"
            }
        ]).then(function (answer) {
            var option = answer.choice;
            console.log(option);
            switch (option) {
                case "View Products For Sale":
                    viewItems();
                    break;
                case "View Low Inventory":
                    viewLowStock();
                    break;
                case "Restock Products":
                    restockItem();
                    break;
                case "Add New Product":
                    newProduct();
                    break;
                case "Return to Home":
                    enterStore();
                    break;
            }
        })
}
function viewItems() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log(results);
    })
    chooseOption();
}
function viewLowStock() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        for (var k = 0; k < results.length; k++) {
            if (results[k].stock < 5) {
                console.log(results[k]);
            }
        }
        chooseOption();
    })
}


function restockItem() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product);
                        }
                        return choiceArray;
                    },
                    message: "What Item would you like to restock?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to add to the stock?"
                }
            ])
            .then(function (answer) {

                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock: chosenItem.stock += answer.quantity
                        },
                        {
                            id: chosenItem.id
                        }
                    ], function (error) {
                        if (error) throw err;
                        console.log(chosenItem.stock);
                        console.log("You Have been restocked!!");

                    })
            })
    })
    enterStore();
}

function newProduct() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What product would you like to add to the catalog?"
            },
            {
                name: "category",
                type: "input",
                message: "What Department does this product belong in?"
            },
            {
                name: "cost",
                type: "input",
                message: "How much does this product cost?"
            },
            {
                name: "stockLevel",
                type: "input",
                message: "How many would you like in stock?"
            }

        ]).then(function (answer) {

            console.log("Updating product catalog with new item...\n");
            connection.query(
                "INSERT INTO products SET ?",
                [
                    {
                        product: answer.name,
                        department: answer.category,
                        price: answer.cost,
                        stock: answer.stockLevel
                    },
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " product catalog updated!\n");
                    enterStore();
                })
        });
}

