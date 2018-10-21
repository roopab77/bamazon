//Requiring all the packages used in this application.
var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("cli-table");

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

//This function will show the products available on page load. 
function showProducts() {
  var data_to_customer = [];
  var display_table = new table({
    head: ["Product Name", "Price", "Quantity"],
    colWidths: [35, 10, 10]
  });

  db.query("SELECT * FROM products", function (err, allItems) {
    if (err) throw err;
    allItems.forEach(item => {
      display_table.push([item.product_name, "$" + parseFloat(item.price).toFixed(2), item.stock_quantity]);
      //data_to_customer.push(item.item_id + "." + item.product_name + "-" + item.stock_quantity);
      data_to_customer.push({
        //itemID : item.item_id,
        name : item.product_name,
        value : item.item_id + "-" + item.stock_quantity + "-" + item.price,
        short : item.item_id +"."+ item.product_name
      });
    });
    console.log(display_table.toString());
    //console.log(data_to_customer);
    askCustomerToBuy(data_to_customer);
  });
}

//This function will ask the customer to if they want to buy any product and if so how much 
function askCustomerToBuy(products)
{
  var choices  = []; 
  inquirer.prompt([
    {
      type : "list",
      name : "option",
      message : "Would you like to purchase any of the items below?",    
     // choices: products.map(choice=>{return choice.display;})  
     choices:products                    
    } ,
    {
      type : "input",
      name : "quantity",
      message : "How many would you like to buy?",
      validate : function(value) {
        var pass = value.match(/^[0-9]/);
        if (pass) {return true;}
        return 'Please enter a valid amount';
    }
  }  
  ]).then(function(answers)
  {
    var itemID = answers.option.split("-")[0];
    var itemQuantity = parseInt(answers.option.split("-")[1]);
    var itemPrice = answers.option.split("-")[2];

    //console.log(answers);
    if(itemQuantity < parseInt(answers.quantity))
    {
      console.log("from database  " + itemQuantity);
      console.log("iam asking for " + answers.quantity); 
      console.log("There is not enough quantity to fulfil your order");
      askCustomerToBuy(products);
    }
    else
    {
      var updatedQuantity = parseInt(itemQuantity) - parseInt(answers.quantity);
      var sales = parseInt(answers.quantity) * parseFloat(itemPrice);
      var updated = updateQuantity(itemID,updatedQuantity,sales);
      if(updated)
      {
        
        var totalcost = parseFloat(itemPrice) * parseInt(answers.quantity);
        var display_table = new table({
          head: ["Total Cost :  " + " $"+ totalcost  ],
          colWidths: [50]
        });
        console.log(display_table.toString());
        checktoContinue();
      }

    }
  });
}

//Once the customer decides to get a product and quantity update the quantitiy in the database
function updateQuantity(itemID,itemQuantity,sales)
{
  db.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [itemQuantity, itemID],function(err,userResp){
    if(err) return false;
  });

  //console.log("Updating quantities...\n");
  var query = db.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: itemQuantity,
        product_sales : sales.toFixed(2)
      },
      {
        item_id: itemID
      }
    ],
    function(err, res) {
      //console.log(res.affectedRows + " products updated!\n");
           
    }
  );

  // logs the actual query being run
  //console.log(query.sql);
  return true;



}

//After all the questions ask them if they want to continue, if so repeat the whole process else exit from the app.
function checktoContinue()
{
  inquirer.prompt([
    {
      type : "list",
      name : "option",
      message : "Would you like to continue to shop?",     
     choices: ["Yes", "No"]                    
    }     
  ]).then(function(answers)
  {
    //console.log(answers);
    if(answers.option == "Yes")
    {
      showProducts();
    }
    else
    {
      process.exit();
    }
});
}
