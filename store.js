var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazonDB"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    start();
  });
 
  function start() {
    inquirer
      .prompt({
        name: "buy",
        type: "rawlist",
        message: "Welcome to BAMAZON pick an option to enter my store",
        choices: ["ENTER", "EXIT"]
      })
      .then(function(answer) {
       if (answer.buy.toUpperCase() === "ENTER") {
        buyItem();
        }

      });
  }
  
  function buyItem() 
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].product_name);
              }
              return choiceArray;
            },
            message: "What Item would you like to buy?"
          },
          {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy"
          }
        ])
        .then(function(answer) {
         
          var chosenItem;
          for (var i = 0; i < results.length; i++) {
            if (results[i].product_name === answer.choice) {
              chosenItem = results[i];
            }
          }
       
        if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: answer.quantity
                },
                {
                  id: chosenItem.id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("Thank you or your Order!");
                start();
              }
            );
          }
          else {
            console.log("Sorry we do not have the quantity of items you selected in stock");
            start();
          }
          
        });
    });
  