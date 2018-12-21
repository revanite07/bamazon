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
                case "View Low Inventory":
                    viewLowStock();
                case "Restock Products":
                    restockItem();
                case "Add New Product":
                //newProduct();
                case "Return to Home":
                    enterStore();
                    break;
            }
        })
}
function viewItems() {
    connection.query("SELECT * FROM products", function (err, results) {
        console.log(results);
    })
    
}
function viewLowStock() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        if (results.stock < 5){
            console.log(results);
        }
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
    
}

