const chalk = require('chalk');
const DB = require("./db_connect.js").code;
const ConfigDB = require("../models/config.js");

module.exports = {
    m_name: "Initalization of the DB",
    code: async () => {
        if (DB.connectionObj == null) {
            return console.error(`${chalk.green("[MONGODB]")} ${chalk.red("[ERROR]")} The DB is not connected yet!`);
        }

        console.log(`${chalk.green("[MONGODB]")} Starting initialization...`);

        var models = DB.connectionObj.mongoose.models;
        var configModelTest = models.config;

        if (!await ConfigDB.exists({ name: "username" }) ) {
            await new ConfigDB({
                name: "username",
                type: "string",
                d_name: "Username",
                value: ""
            }).save().then(newDoc => {
                if (newDoc => ConfigDB) {
                    console.info(`${chalk.green("[MONGODB] [+]")} Created username field in config tab`)
                } else {
                    console.error(`${chalk.green("[MONGODB]")} Failed to create username field in config tab`)
                }
            });
        }

        if (!await ConfigDB.exists({ name: "password" }) ) {
            await new ConfigDB({
                name: "password",
                type: "string",
                d_name: "Password",
                value: ""
            }).save().then(newDoc => {
                if (newDoc => ConfigDB) {
                    console.info(`${chalk.green("[MONGODB] [+]")} Created password field in config tab`)
                } else {
                    console.error(`${chalk.green("[MONGODB]")} Failed to create password field in config tab`)
                }
            });
        }

        console.log(`${chalk.green("[MONGODB]")} DataBase initialization completed!`)
    }
}