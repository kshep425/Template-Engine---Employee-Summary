const Employee = require("./Employee")

class Manager extends Employee {
    constructor(name, id, email, office_number) {
        super(name, id, email)
        this.office_number = office_number;
    }

    get_role() {
        return "Manager"
    }

    get_office_number() {
        return this.office_number
    }

    get_icon() {
        return "fa-coffee"
    }

}

module.exports = Manager;