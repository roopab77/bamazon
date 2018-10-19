//Requiring all the packages used in this application.
var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("table");

import {table} from '/node_modules/table';

//Defining all the necessary variables to establish connection with the database
var db = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

//establishing a connection with the database
db.connect(err => {
  if (err) throw err;
  console.log(`Connected on ${db.threadId}`);
  // when turned on, start auction
  showProducts();
});

function showProducts()
{
  data=["Product Name", "Price","Quantity"];
  db.query("SELECT * FROM products",function(err,allItems){
    if(err) throw err;
    allItems.forEach(item => {
    data.push([item.product_name,item.price,item.stock_quantity]);    
    });
    console.log(table(data));
  });
}