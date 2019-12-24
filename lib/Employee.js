class Employee {
    constructor(name, id, email) {
        this.name = name;
        this.id = id;
        this.email = email;
    }

    get_name() {
        return this.name;
    }

    get_id() {
        return this.id;
    }

    get_email() {
        return this.email;
    }

    get_role() {
        return "Employee";
    }

    get_icon() {
        return "fa-user"
    }
    // print_info() {
    //     for (var key in this) {
    //         console.log(`${key}: ${this[key]}`);
    //     }
    // }

}

module.exports = Employee;