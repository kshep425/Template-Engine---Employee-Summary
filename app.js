const inquirer = require("inquirer");
const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const fs = require("fs")
const cheerio = require('cheerio')
const open = require ("open")

let num = 0;
let id_num = 0;

let employees = [
    new Manager("Donald Hesler", id_num+=1, "dhesler@kdsdreamtech.com", "Hodson 316"),
    new Engineer("Jono Augustine",id_num+=1, "jono@kdsdreamtech.com", "jonoaugustine"),
    new Intern("Jody Jones", id_num+=1, "jody@kdsdreamtech", "Morgan State University"),
    new Employee("Gregg vonBushberger", id_num+=1, "gvonbush@kdsdreamtech.com")
]

const employee_defaults = [
    {role:"Manager", name: "Keisha Shepherd", email: "kshepher@kdsdreamtech.com", office_number: "Hodson 213"},
    {role:"Engineer", name: "Stetson Lewis", email: "slewis@kdsdreamtech.com", github: "stetzon"},
    {role:"Intern", name: "Jordyn Saltzman", email: "jsaltz@kdsdreamtech.com", school: "Towson University"},
    {role:"Employee", name: "Tina Rain", email: "tina@kdsdreamtech.com"}
]

const questions = [
    {
        name: "role",
        message: "Enter role",
        type: "list",
        choices: ["Employee", "Manager", "Engineer", "Intern"],
        default: function() {return employee_defaults[num%4].role}
    },

    {
        name: "name",
        message: "Enter name",
        type: "input",
        default: function() {return employee_defaults[num%4].name}
    },

    {
        name: "email",
        message: "Enter email",
        type: "input",
        default: function() {return employee_defaults[num%4].email},
        validate: function (email) {

            valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)

            if (valid) {
                return true;
            } else {
                console.log("Please enter a valid email")
                return false;
            }
        }
    },

    {
        name: "office_number",
        message: "Enter office number",
        type: "input",
        default: function() {return employee_defaults[num%4].office_number},
        when: function (answers) {
            return answers.role === "Manager"
        },

    },

    {
        name: "school",
        message: "Enter school",
        type: "input",
        default: function() {return employee_defaults[num%4].school},
        when: function (answers) {
            return answers.role === "Intern"
        }
    },

    {
        name: "github",
        message: "Enter github username",
        type: "input",
        default: function() {return employee_defaults[num%4].github},
        when: function (answers) {
            return answers.role === "Engineer"
        }
    }


]

function get_info(call_back) {
    inquirer
        .prompt(questions)
        .then(function (response) {
            console.log(response);

            let employee;

            id_num+=1
            num+=1

            if (response.role === "Employee") {
                //create employee
                employee = new Employee(response.name, id_num , response.email)
            } else if (response.role === "Manager") {
                //create manager
                employee = new Manager(response.name, id_num, response.email, response.office_number)
            } else if (response.role === "Intern") {
                //create intern
                employee = new Intern(response.name, id_num, response.email, response.school)
            } else if (response.role === "Engineer") {
                //create engineer
                employee = new Engineer(response.name, id_num, response.email, response.github)
            }

            employees.push(employee)

            call_back()
        })

}

const add_employee_question = [
    {
        type: "confirm",
        message: "Input another employee",
        name: "run_again",
        default: true
    }
]

function add_employee() {
    inquirer
        .prompt(add_employee_question)
        .then(function (response) {
            if (response.run_again === true) {
                get_info(add_employee);
            } else {
                write_html()
            }
        })
}

async function write_html() {
    let team_html = await fs.readFileSync("./output/template.html", "utf8", function (err) {
        if (err) {
            console.log("Houston there's a problem")
        }
    })

    const $ = cheerio.load(team_html)

    employees.forEach(emp => {

        const role = emp.get_role()
        const icon = $("<i>").addClass("fa " + emp.get_icon());
        const emp_name = $("<h3>").addClass("content-subhead emp_name").html(icon + emp.get_name());
        const emp_role = $("<h4>").addClass("role").text(emp.get_role());
        const emp_id = $("<p>").addClass("id").text("ID: " + emp.get_id());
        const emp_email = $("<p>").addClass("email").text(emp.get_email());
        let emp_role_info;
        if (role === "Engineer") { emp_role_info = $("<a>").addClass("role_info").attr('href', 'https://github.com/' + emp.get_github()).text(emp.get_github()) };
        if (role === "Intern") { emp_role_info = $("<p>").addClass("role_info").text(emp.get_school()) };
        if (role === "Manager") { emp_role_info = $("<p>").addClass("role_info").text(emp.get_office_number()) };

        const employee_container = $("<div>").addClass("l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4 employee_container")

        $(employee_container).append(emp_name)
        $(employee_container).append(emp_id)
        $(employee_container).append(emp_email)
        $(employee_container).append(emp_role)
        $(employee_container).append(emp_role_info)
        $(".employees").append(employee_container)

    });

    fs.writeFile("./output/team.html", $.html(), function (err) {
        if (err) {
            console.log("Houston there's a problem")
        }
        open_html()

    })
}

async function open_html(filename='./output/team.html') {
    // Opens the image in the default image viewer and waits for the opened app to quit.
    await open(filename, {wait: true});
    console.log('Opening: ' + __dirname + "\\output\\team.html")
};

add_employee()
