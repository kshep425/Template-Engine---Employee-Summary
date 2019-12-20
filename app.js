const inquirer = require("inquirer")
let id_num = 0
const questions = [
    {
        name: "role",
        message: "What is your role?",
        type: "list",
        choices: ["Employee", "Manager", "Engineer", "Intern"],
        default: "Employee"
    },
    {
        name:"name",
        message: "What is your name?",
        type: "input",
        default: "Keisha Shepherd"
    },

    {
        name:"email",
        message: "What is your email?",
        type: "input",
        default: "kshep425@gmail.com"
    },

    {
        name:"id",
        message: "What is your id?",
        type: "input",
        default: "1",

    },

    {
        name:"office_number",
        message: "What is your office number?",
        type: "input",
        default: "A1234",
        when: function(answers){
            return answers.role === "Manager"
        },

    },

    {
        name:"school",
        message: "What is your school?",
        type: "input",
        default: "Morgan State University",
        when: function(answers){
            return answers.role === "Intern"
        }
    },

    {
        name:"github",
        message: "What is your github user name?",
        type: "input",
        default: "kshep425",
        when: function(answers){
            return answers.role === "Engineer"
        }
    }


]

function get_info(){
    inquirer
    .prompt(questions)
    .then(function (response){
        console.log(response);
    })
}

get_info()
