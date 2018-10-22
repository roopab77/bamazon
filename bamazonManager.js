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
  showOptions();
});

//This function would show all the options that the manager can make to update,show,add a product and exit
function showOptions() {
  inquirer.prompt([{
    type: "list",
    name: "option",
    message: "Would you like to purchase any of the items below?",
    choices: ["View products for Sale", "View Low Inventory", "Add to Inventory", "Add new Product","Exit"]
  }]).then(function (answers) {
    switch (answers.option) {
      case "View products for Sale":
        showProducts();
        break;
      case "View Low Inventory":
        showLowInventory();
        break;
      case "Add to Inventory":
        addtoInventory();
        break;
      case "Add new Product":
        addnewProduct();
        break;
        case "Exit":
        process.exit();

    }
  });
}

//This function would select all the products from the database and show it 
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
      data_to_customer.push({

        name: item.product_name,
        value: item.item_id + "-" + item.stock_quantity + "-" + item.price,
        short: item.item_id + "." + item.product_name
      });
    });
    console.log(display_table.toString());
    showOptions();
  });
}

//This function shows the products which has the quantity less than 5 as low inventory
function showLowInventory() {

  var display_table = new table({
    head: ["Product Name", "Price", "Quantity"],
    colWidths: [35, 10, 10]
  });
  db.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, allItems) {
    if (err) throw err;
    allItems.forEach(item => {
      display_table.push([item.product_name, "$" + parseFloat(item.price).toFixed(2), item.stock_quantity]);
    });
    if(allItems.length == 0)
    {
      display_table.push(["No products with low inventory","",""]);
    }
    console.log(display_table.toString());
    showOptions();
  });
}

//If the user wishes they can update the quantity in the products table and add the quantity of the product chosen
function addtoInventory() {
  var lowinventory = [];
  db.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, allItems) {
    if (err) throw err;
    allItems.forEach(item => {
      lowinventory.push({
        name: item.product_name,
        value: item.item_id + "-" + item.stock_quantity + "-" + item.price,
        short: item.item_id + "." + item.product_name
      });
    });
    if(allItems.length > 0)
    {
    inquirer.prompt([{
        type: "list",
        name: "option",
        message: "Pick which item would you update the quantity?",
        choices: lowinventory
      },
      {
        type: "input",
        name: "quantity",
        message: "How much would you add?",
        validate: function (value) {
          var pass = value.match(/^[0-9]/);
          if (pass) {
            return true;
          }
          return 'Please enter a valid amount';
        }
      }
    ]).then(function (answers) {
      var itemID = answers.option.split("-")[0];
      var itemQuantity = parseInt(answers.option.split("-")[1]);
      var updatedQuantity = parseInt(itemQuantity) + parseInt(answers.quantity);
      var updated = updateQuantity(itemID, updatedQuantity);
      if (updated) {
        console.log("Quantity updated Succesfully");
        showOptions();
      }
    });
     }
     else
     {
       console.log("There are no items with low inventory");
       showOptions();
     }
  });

}

//This is the database query to update the quantity for the product chosen.
function updateQuantity(itemID, itemQuantity) {

  var query = db.query(
    "UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: itemQuantity
      },
      {
        item_id: itemID
      }
    ],
    function (err, res) {
      //console.log(res.affectedRows + " products updated!\n");           
    }
  );
  // logs the actual query being run
  //console.log(query.sql);
  return true;
}

//This function would get the product details to add new row into the products table. 
function addnewProduct() {

  inquirer.prompt([{
      type: "input",
      name: "name",
      message: "What is the product you want to add?",
      validate: function (value) {
        if (!value) {
          return "Please enter a valid name";
        } else {
          return true;
        }
      }
    },
    {
      type: "input",
      name: "department",
      message: "Please mention the category for the product",
      validate: function (value) {
        if (!value) {
          return "Please enter a valid category";
        } else {
          return true;
        }
      }
    },
    {
      type: "input",
      name: "quantity",
      message: "How much would you add?",
      validate: function (value) {
        var pass = value.match(/^[0-9]/);
        if (pass) {
          return true;
        }
        return 'Please enter a valid amount';
      }
    },
    {
      type: "input",
      name: "price",
      message: "What is the price of your product?",
      validate: function (value) {
        var pass = value.match(/^[1-9]\d*(\.\d+)?$/);
        if (pass) {
          return true;
        }
        return 'Please enter a valid price';
      }
    }
  ]).then(function (answers) {
    var insertproduct = insertIntoDB(answers.name, answers.department, answers.quantity, answers.price);
    if(insertproduct)
    {
      console.log("Product added succesfully");
      showOptions();
    }
  });
}

//This is the database query to add the product to the table.
function insertIntoDB(itemname,department, itemQuantity, itemprice) {
  //console.log("Updating quantities...\n");
  var query = db.query(
    "INSERT INTO products (product_name,department_name, stock_quantity, price) VALUES (?,?,?,?)", [itemname, department, itemQuantity, itemprice],
    function (err, res) {
      if (err) console.log(err);

    }
  );
  return true;
}