const inquirer = require("inquirer");
const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const fs = require("fs")
const cheerio = require('cheerio')

let id_num = 0;

const questions = [
    {
        name: "role",
        message: "Enter role",
        type: "list",
        choices: ["Employee", "Manager", "Engineer", "Intern"],
        default: "Employee"
    },
    {
        name: "name",
        message: "Enter name",
        type: "input",
        default: "Keisha Shepherd"
    },
    {
        name: "email",
        message: "Enter email",
        type: "input",
        default: "kshep425@gmail.com",
        validate: function (email) {
            //console.log("\nYou entered email: " + email)
            valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            //console.log("valid email:  " + valid)
            if (valid) {
                return true;
            } else {
                return false;
            }
        }
    },

    {
        name: "id",
        message: "Enter id",
        type: "Number",
        default: function () {
            return id_num += 1;
        },

    },

    {
        name: "office_number",
        message: "Enter office number",
        type: "input",
        default: "A1234",
        when: function (answers) {
            return answers.role === "Manager"
        },

    },

    {
        name: "school",
        message: "Enter school",
        type: "input",
        default: "Morgan State University",
        when: function (answers) {
            return answers.role === "Intern"
        }
    },

    {
        name: "github",
        message: "Enter github username",
        type: "input",
        default: "kshep425",
        when: function (answers) {
            return answers.role === "Engineer"
        }
    }


]

let employees = [new Employee("Alicia Keys", 1, "akeys@kdsdreamtech.com"), new Manager("Keisha Diane Shepherd", 2, "kshepherd@kdsdreamtech.com", "K425"), new Engineer("Jono Augustine", 3, "jono@kdsdreamtech.com", "jonoaugustine"), new
Engineer("Z Boykin", 4, "kshep425", "Morgan State University")]

function get_info(call_back) {
    inquirer
        .prompt(questions)
        .then(function (response) {
            console.log(response);
            let employee;
            let employee_html = ""
            if (response.role === "Employee") {
                //create employee
                employee = new Employee(response.name, response.id, response.email)
            } else if (response.role === "Manager") {
                //create manager
                employee = new Manager(response.name, response.id, response.email, response.office_number)
            } else if (response.role === "Intern") {
                //create intern
                employee = new Intern(response.name, response.id, response.email, response.school)
            } else if (response.role === "Engineer") {
                //create engineer
                employee = new Engineer(response.name, response.id, response.email, response.github)
            }
            employees.push(employee)
            // employees.forEach(emp =>{
            //     console.log(emp.get_name())
            //     employee_html += `<h1>${emp.get_name}<h1>`


            // }) //for each

            // console.log(employee_html)
            // let team_html = fs.readFile("./output/template.html", "utf8", function(err, data){
            //     if(err){
            //         console.log("Houston there's a problem")
            //     }
            //     console.log("team_html: " + data)
            //     team_html.replace("||", employee_html)
            //     fs.writeFile("./output/team.html", team_html, function (err){
            //         if(err){
            //             console.log("Houston there's a problem")
            //         }
            //         console.log("Open team.html")
            //     }
            //     )
            // })

            call_back()
        })//.then


}

add_employee_question = [
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
            console.log(response)
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

        //emp_name.append(icon)
        //$(emp_name).append(icon)
        $(employee_container).append(emp_name)
        $(employee_container).append(emp_id)
        $(employee_container).append(emp_email)
        $(employee_container).append(emp_role)
        $(employee_container).append(emp_role_info)
        $(".employees").append(employee_container)

        //console.log($.html())
    });

    console.log($.html())
    fs.writeFile("./output/team.html", $.html(), function (err) {
        if (err) {
            console.log("Houston there's a problem")
        }
        console.log("Open ./output/team.html")
    })
}

//write_html()

get_info(add_employee);
//add_employee();
