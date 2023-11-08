const chalk = require('chalk');
const DB = require("./db_connect.js").code;
const ConfigDB = require("../models/config.js");
const UserDB = require("../models/account.js");
const { User } = require('@androz2091/insta.js');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
    name: "Initalization of the DB",
    code: async () => {
        if (DB.connectionObj == null) {
            return console.log(`${chalk.green("[MONGODB]")} ${chalk.red("X")} The DB is not connected yet!`);
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
                writeLog(console.getLogs().filter((element) => console.getLogs()[dbInitKey][0] !== element[0]))
                console.log(`${chalk.green("[MONGODB] ✓")} DB initialization completed and ready to use!`)
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
                    console.log(`${chalk.green.bold("[MONGODB] [+]")} Created password field in config tab`)
                } else {
                    console.log(`${chalk.green("[MONGODB]")} Failed to create password field in config tab`)
                }
            });
        }

        if ((await UserDB.model.find({})).length == 0) {
            new UserDB.model({
                username: "admin",
                password: "admin",
                rank: "admin"
            }).save().then(() => {
                console.log(`${chalk.green.bold("[MONGODB] +")} Created first account ${chalk.bold("(user: admin, password: admin)")} with admin rights.`)
            })
        }

        initFinished = true;

        async function endActions(line) {
            console.log(line)
        }
    }
}