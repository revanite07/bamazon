DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id(11) INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR (50)
  price DECIMAL(10,2) NULL,
  stock_quantity INTEGER(10),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity);
VALUES ("Lego Set", "Toys", 20, 100), ("Winter Jacket", "Clothing", 45, 50), 
("Aux Cord", "Electronics", 9, 1000), ("PS4", "Electronics", 200, 100), ("Vans Shoes", "Shoes", 60, 150),
("Phone Car Charger", "Electronics", 8, 1000), ("Laptop Case", "Electronics Accessroies", 15, 1000), 
("Bose Headphones", "Electronics", 150, 50), ("Bed Sheet Set", "Home", 60, 500), ("Book Shelf", "Home", 40, 200), 
("Dewalt Power Drill", "Tools", 30, 200), (" Car Headlight Bulb", "Automotive", 10, 200), ("DeWalt Generator", "Tools", 100, 30),
("iPhone Case" "Electronic Accessroies");

