--This part creates a database bamazon and creates a table called PRODUCT in bamazon database
DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR(200) NOT NULL,  
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,  
  PRIMARY KEY (item_id)
);
