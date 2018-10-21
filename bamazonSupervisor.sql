USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(200) NOT NULL,  
  over_head_costs DECIMAL(10,2) NOT NULL,    
  PRIMARY KEY (department_id)
);

ALTER TABLE products ADD COLUMN product_sales DECIMAL(20,2) ;
