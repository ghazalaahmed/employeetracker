const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require ('inquirer'); 
const connection = mysql.createConnection({
  host: "localhost",

  
  port: 3001,


  user: "root",

  password: "Bootcamp!",
  database: "employee_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start(); 
});

function start(){
  inquirer
  .prompt ([
    {
      type: "list", 
      message: "What would you like to do?",
      name: "start",
      choices: [
      "View All Employees", 
      "Add Employee", 
      "Update Employee Role",
      "View all Roles", 
      "Add Role",
      "View All Departments", 
      "Add Department", 
      "Remove Employee",
      "Quit", 
      
    ]
    }
  ])
  .then (function(res){
    switch (res.start){

      case "Add Employee":
      addEmployee();
      break;
     
      case "View all Employees":
      viewAllEmployees();
      break; 

      case "Remove Employee": 
      removeEmployee(); 
      break;
    
      case "Add Department": 
      addDept(); 
      break;

      case "View all Departments":
      viewAllDept();
      break;

      case "Add Role": 
      addRole(); 
      break;

      case "View all Roles": 
      viewAllRoles(); 
      break;
    
      case "Update Employee Role":
      updateEmployeeRole(); 
      break;

      case "Quit":
      connection.end(); 
      break; 
    }
  })
}

function addEmployee() {
console.log("Inserting a new employee.\n");
inquirer 
  .prompt ([ 
    {
      type: "input", 
      message: "First Name?",
      name: "first_name",
    },
    {
      type: "input", 
      message: "Last Name?",
      name: "last_name"
    },
    {
      type: "list",
      message: "What is the employee's role?",
      name: "role_id", 
      choices: [1,2,3]
    },
    {
      type: "input", 
      message: "Who is the employee's manager?",
      name: "manager_id"
    }
  ])
  .then (function(res){
    const query = connection.query(
      "INSERT INTO employees SET ?", 
     res,
      function(err, res) {
        if (err) throw err;
        console.log( "Employee added!\n");

        start (); 
      }
    );    
  })
}
function viewAllEmployees() {

  connection.query("SELECT employees.first_name, employees.last_name, roles.title AS \"role\", managers.first_name AS \"manager\" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN employees managers ON employees.manager_id = managers.id GROUP BY employees.id",  
  function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function removeEmployee(){
  let employeeList = [];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees", (err,res) => {
      for (let i = 0; i < res.length; i++){
        employeeList.push(res[i].first_name + " " + res[i].last_name);
      }
  inquirer 
  .prompt ([ 
    {
      type: "list", 
      message: "Which employee would you like to delete?",
      name: "employee",
      choices: employeeList

    },
  ])
  .then (function(res){
    const query = connection.query(
      `DELETE FROM employees WHERE concat(first_name, ' ' ,last_name) = '${res.employee}'`,
        function(err, res) {
        if (err) throw err;
        console.log( "Employee deleted!\n");
     start();
    });
    });
    }
      );
      };

function addDept(){
  inquirer
  .prompt([
    {
      type: "input",
      name: "deptName", 
      message: "What is the name of the department?"
    }
  ])
  .then(function(res){
    console.log(res);
    const query = connection.query(
      "INSERT INTO departments SET ?", 
      {
        name: res.deptName
      }, 
      function(err, res){
        connection.query("SELECT * FROM departments", function(err, res){
          console.table(res); 
          start(); 
        })
      }
    )
  })
}

function viewAllDept(){
connection.query ("SELECT * FROM departments", function(err, res){
  console.table(res);
  start();
})
}

function addRole() {
  let departments= []; 
connection.query("SELECT * FROM departments",
function(err,res){
  if(err) throw err;
  for (let i=0; i <res.length; i++){
    res[i].first_name + " " + res[i].last_name
    departments.push({name: res[i].name, value: res[i].id});
  }
inquirer
.prompt([
  {
    type: "input", 
    name: "title",
    message: "What is the name of the role?"
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary of the role?"
  },
  {
    type: "list",
    name: "department",
    message: "which department does the role belong to?",
    choices: departments
  }
])
.then (function(res){
  console.log(res); 
  const query = connection.query(
    "INSERT INTO roles SET ?",
    {
      title: res.title,
      salary: res.salary,
      department_id: res.department
    }, 
    function (err, res){
      if (err) throw err;
      start(); 
    }
  )
})
})
}

function viewAllRoles(){
  connection.query("SELECT roles.*, departments.name FROM roles LEFT JOIN departments ON departments.id = roles.department_id", function (err,res){
    if (err) throw err;
    console.table(res);
    start();
  }
  )
  }

function updateEmployeeRole(){
​
connection.query("SELECT first_name, last_name, id FROM employees",
function(err,res){
  let employees = res.map(employee => ({name: employee.first_name + " " + employee.last_name, value: employee.id}))
​
  inquirer
  .prompt([
    {
      type: "list",
      name: "employeeName",
      message: "Which employee's role do you want to update?", 
      choices: employees
    },
    {
      type: "input",
      name: "role",
      message: "Which role do you want to assign to the selected employee?"
    }
  ])
  .then (function(res){
    connection.query(`UPDATE employees SET role_id = ${res.role} WHERE id = ${res.employeeName}`,
    function (err, res){
      console.log(res);
      start()
    }
    );
  })
}
)
}


