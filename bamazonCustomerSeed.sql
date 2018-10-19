--Inserting mock data into the products table in bamazon database

USE bamazon;
INSERT INTO products(product_name,department_name,price,stock_quantity)
 VALUES
("Dining Table with 6 Chairs","Furniture",1000.00,10),
("Mikel Platform Bed","Furniture",250.00,5),
("Madrid Throw Pillow","Furniture",20.00,3),
("Laser Infrared Thermometer","Hardware",19.90,10),
("Bamboo Charcoal Air Freshner","Home",27.99,56),
("Apple IPAD Pro","Electronics",1200.00,2),
("Yamaha Stereo Receiver","Electronics",149.95,10),
("Handmade small wooden spoon","Kitchen",5.99,4);

SELECT * FROM products;