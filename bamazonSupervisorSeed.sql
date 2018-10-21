USE bamazon;
INSERT INTO departments(department_name,over_head_costs)
 VALUES
("Furniture",20020.00),
("Hardware",10000.00),
("Electronics",20000.00),
("Kitchen",6000.00);



SELECT department_id, departments.department_name, over_head_costs, product_sales, (over_head_costs - product_sales) AS total_profit FROM departments INNER JOIN products 
on departments.department_name = products.department_name GROUP BY products.department_name;

