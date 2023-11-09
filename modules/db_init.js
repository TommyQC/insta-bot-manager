const chalk = require('chalk');
const DB = require("./db_connect.js").code;
const ConfigDB = require("../models/config.js");
const UserDB = require("../models/account.js");
const RanksDB = require("../models/ranks.js");
const { User } = require('@androz2091/insta.js');
const bcrypt = require("bcryptjs")
const authAPI = require("./auth.js");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
    priority: 3,
    name: "Initalization of the DB",
    code: async () => {
        if (await DB.connectionObj == null) {
            return console.log(`${chalk.green("[MONGODB]")} ${chalk.red("[ERROR]")} The DB is not connected yet!`);
        }

        initFinished = false;

        console.log(`${chalk.green("[MONGODB] ▶")} Starting DB initialization`);

        initDBInter = setInterval(async() => {
            dbInitKey = Object.keys(console.getLogs()).find((key) => console.getLogs()[key][0].includes(`${chalk.green("[MONGODB] ▶")} Starting`));

            writeLog = function(array) {
                console.clear()

                Object.entries(array).forEach(entry => {
                    const [key, value] = entry;

                    if (key == dbInitKey) {
                        if (value[0].split(".").length - 1 == 3) {
                            value[0] = value[0].replaceAll(".", "")
                        }
                        console.log(value[0] + ".")
                    } else {
                        console.log(value[0]);
                    }
                });
            }

            writeLog(console.getLogs())

            if (initFinished == true) {
                clearInterval(initDBInter);
                //writeLog(console.getLogs().filter((element) => console.getLogs()[dbInitKey][0] !== element[0]))
                currentLogs = console.getLogs()
                currentLogs[dbInitKey][0] = `${chalk.green("[MONGODB] ✓")} DB initialization completed and ready to use!`
                writeLog(currentLogs)
            }
        }, 500);

        if (!await ConfigDB.exists({ name: "username" }) ) {
            await new ConfigDB({
                name: "username",
                type: "string",
                d_name: "Username",
                value: ""
            }).save().then(newDoc => {
                if (newDoc => ConfigDB) {
                    console.log(`${chalk.green.bold("[MONGODB] +")} Created username field in config tab`)
                } else {
                    console.log(`${chalk.green("[MONGODB]")} Failed to create username field in config tab`)
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
                    console.log(`${chalk.green.bold("[MONGODB] +")} Created password field in config tab`)
                } else {
                    console.log(`${chalk.green("[MONGODB]")} Failed to create password field in config tab`)
                }
            });
        }

        if (!await RanksDB.exists({ name: "admin" })) {
            await RanksDB.create({
                name: "admin",
                displayName: "Administrator",
                style: "text-danger",
                permissions: "ALL"
            }).then(() => {
                console.log(`${chalk.green("[MONGODB] +")} Created default admin rank in collection ${chalk.bold("ranks")}`);
            }).catch((error) => {
                console.log(`${chalk.green("[MONGODB]")} ${chalk.red("[ERROR]")} Failed to create admin rank in database.`);
                config.website.logErrors ? console.error(error) : "";
            })
        }

        if (!await RanksDB.exists({ name: "user" })) {
            await RanksDB.create({
                name: "user",
                displayName: "User",
                style: "text-success",
                permissions: "NONE"
            }).then(() => {
                console.log(`${chalk.green("[MONGODB] +")} Created default user rank in collection ${chalk.bold("ranks")}`);
            }).catch((error) => {
                console.log(`${chalk.green("[MONGODB]")} ${chalk.red("[ERROR]")} Failed to create user rank in database.`);
                config.website.logErrors ? console.error(error) : "";
            })
        }

        if ((await UserDB.model.find({})).length == 0) {
            await authAPI.create(username = "admin", password = "admin", rank = "admin");
        }

        initFinished = true;
    }
}