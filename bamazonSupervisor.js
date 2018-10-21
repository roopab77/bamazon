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
    choices: ["View product Sales by Department", "Create New Department","Exit"]
  }]).then(function (answers) {
    switch (answers.option) {
      case "View product Sales by Department":
        showProducts();
        break;
      case "Create New Department":
        createNewDepartment();
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
    head: ["Department ID", "Department Name", "Over Head Costs","Product Sales","Total_Profit"],
    colWidths: [10, 20, 15,15,15]
  });

  var query = `SELECT department_id, departments.department_name, over_head_costs, product_sales, (over_head_costs - product_sales) AS total_profit FROM departments INNER JOIN products 
  on departments.department_name = products.department_name GROUP BY products.department_name;`
 
  db.query(query, function (err, allItems) {
    if (err) throw err;
    allItems.forEach(item => {
      display_table.push([item.department_id,item.department_name, "$"+item.over_head_costs ,"$"+item.product_sales ,"$"+item.total_profit]);      
    });
    console.log(display_table.toString());
    showOptions();
  });
}

//This function creates new Department
function createNewDepartment()
{
  inquirer.prompt([{
    type: "input",
    name: "departmentName",
    message: "Department Name to be added?",
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
    name: "overheadCost",
    message: "What would be the overhead cost  of your department?",
    validate: function (value) {
      var pass = value.match(/^[1-9]\d*(\.\d+)?$/);
      if (pass) {
        return true;
      }
      return 'Please enter a valid price';
    }
  }
]).then(function (answers) {
  var insertproduct = insertIntoDB(answers.departmentName, answers.overheadCost);
  if(insertproduct)
  {
    console.log("Department added succesfully");
    showOptions();
  }
});
}

//This is the database query to add the department to the table.
function insertIntoDB(department, overheadcosts) {
  //console.log("Updating quantities...\n");
  var query = db.query(
    "INSERT INTO departments (department_name,over_head_costs) VALUES (?,?)", [department,overheadcosts],
    function (err, res) {
      if (err) console.log(err);

    }
  );
  return true;
}