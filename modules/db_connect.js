const chalk = require('chalk');
const mongoose = require('mongoose');
const config = require("../config.js");

module.exports = {
    priority: 1,
    name: "Databse connection",
    code: class {
        constructor() {
        }

        static async connect() {
            try {
                if (config.website.db_link == "") {
                    console.mongodb(`The ${chalk.bold.underline("db_link")} field can not be empty or invalid ${chalk.grey("(check config file)")}`, true);
                    return process.exit(1);
                }
                var conn = await mongoose.connect(config.website.db_link);
                console.mongodb(`${chalk.green("✓")} Successfully connected to cluster; ${chalk.underline(conn.connection.host)}, on database ${chalk.underline(conn.connection.name)} (port ${conn.connection.port})`);
                this.connectionObj = conn;
            } catch (error) {
                var currentError = error.msg;
                if (error.errmsg === undefined || error.errmsgmsg == null || error.errmsg == "undefined")
                    currentError = error.message

                console.mongodb(`An${error.code === 8000 ? "" : " unknown"} error occured while connecting to the database; ${error.code === 8000 ? `${chalk.grey(`(most likely bad credentials)`)} ${chalk.bold.redBright(currentError)}` : chalk.bold.redBright(currentError)}`, true);

                if (config.website.logErrors === true) {
                    console.error(error);
                }
                
            }
    
            return conn;
        }
    }
}