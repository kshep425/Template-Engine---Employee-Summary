const Employee = require("./Employee")

class Intern extends Employee {
    constructor(name, id, email, school) {
        super(name, id, email)
        this.school = school;
    }

    get_role() {
        return "Intern"
    }

    get_school() {
        return this.school
    }

    get_icon() {
        return "fa-smile-o"
    }

}

module.exports = Intern;