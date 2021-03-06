const Employee = require("./Employee")

class Engineer extends Employee {
    constructor(name, id, email, github) {
        super(name, id, email)
        this.github = github;
    }

    get_role() {
        return "Engineer"
    }

    get_github() {
        return this.github
    }

    get_icon() {
        return "fa-lightbulb-o"
    }

}

module.exports = Engineer;