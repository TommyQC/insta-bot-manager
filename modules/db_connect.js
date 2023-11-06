const chalk = require('chalk');
const mongoose = require('mongoose');
const config = require("../config.js");

module.exports = {
    m_name: "Databse connection",
    code: class {
        constructor() {
        }
    
        static async connect() {
            try {
                if (config.website.db_link == "") {
                    return console.log(`${chalk.green("[MONGODB]")} ${chalk.red("[ERROR]")} The db_link field can not be empty or invalid`);
                }
                var conn = await mongoose.connect(config.website.db_link);
                console.log(`${chalk.green("[MONGODB]")} Successfully connected to cluster : ${chalk.underline(conn.connection.host)}`);
                this.connectionObj = conn;
            } catch (error) {
                console.log(error);
                this.connectionObj = "ERROR";
                var conn = "ERROR";
            }
    
            return conn;
        }
    }
}