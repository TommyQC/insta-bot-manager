const chalk = require('chalk');
const DB = require("./db_connect.js").code;
const ConfigDB = require("../models/config.js");
const UserDB = require("../models/account.js");
const RanksDB = require("../models/ranks.js");
const bcrypt = require("bcryptjs")
const authAPI = require("./auth.js");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
    priority: 3,
    name: "Initalization of the DB",
    code: async () => {
        if (await DB.connectionObj == null) {
            return console.mongodb(`The DB is not connected yet!`)
        }

        newDocuments = {};
        initFinished = false;

        console.log(`${chalk.green("[MONGODB] ▶")} Starting DB initialization`);

        // Setup interval while the database is loading
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
                currentLogs = console.getLogs()
                currentLogs[dbInitKey][0] = `${chalk.green("[MONGODB] ✓")} DB initialization completed and ready to use!`
                writeLog(currentLogs)
            }
        }, 500);

        // Initialization of the models
        await module.exports.initModel(await RanksDB);
        await module.exports.initModel(await UserDB.model);
        await module.exports.initModel(await ConfigDB);

        initFinished = true;

        // Make sure the models are not being dropped.
        if (module.exports.hasInitialized === false) {
            await module.exports.watchModels([require("../models/config.js"), require("../models/account.js").model, require("../models/ranks.js")]).then(() => {
                module.exports.hasInitialized = true;
            });
        }
    },
    initModel: async(model) => {
        // Initialize ranks collection
        if (model.modelName === "ranks") {
            if (!await model.exists({ name: "admin" }) || !await model.exists({ name: "user" })) {
                console.mongodb(`Missing elements in ${chalk.bold.underline("ranks")} collection`)
    
                if (!await model.exists({ name: "admin" })) {
                    module.exports.createNew(model, {
                        name: "admin",
                        displayName: "Administrator",
                        style: "text-danger",
                        permissions: "ALL"
                    }, async (document) => {
                        console.mongodb(`Created default admin rank in collection ${chalk.bold("ranks")}`, false, true)
                    }, async (error) => {
                        console.mongodb(`Failed to create admin rank in database.`, true)
                        config.website.logErrors ? console.error(error) : "";
                    })
                } 
    
                if (!await model.exists({ name: "user" })) {
                    module.exports.createNew(model, {
                        name: "user",
                        displayName: "User",
                        style: "text-success",
                        permissions: "NONE"
                    }, async (document) => {
                        console.mongodb(`Created default user rank in collection ${chalk.bold("ranks")}`, false, true)
                    }, async (error) => {
                        console.mongodb(`Failed to create user rank in database.`, true)
                        config.website.logErrors ? console.error(error) : "";
                    })
                }
            }    
        }

        // Initialize configs collection
        if (model.modelName === "config") {
            if (!await model.exists({ name: "username" }) || !await model.exists({ name: "password" })) {
                console.mongodb(`Missing elements in ${chalk.bold.underline(model.collection.collectionName)} collection`)
    
                if (!await model.exists({ name: "username" }) ) {
                    module.exports.createNew(model, {
                        name: "username",
                        type: "string",
                        d_name: "Username",
                        value: ""
                    }, async (document) => {
                        console.mongodb(`Created username field in ${model.collection.collectionName} collection`, false, true)
                    }, async (error) => {
                        console.mongodb(`Failed to create username field in ${model.collection.collectionName} collection`, true)
                    })
                }
    
                if (!await model.exists({ name: "password" }) ) {
                    module.exports.createNew(model, {
                        name: "password",
                        type: "string",
                        d_name: "Password",
                        value: ""
                    }, async (document) => {
                        console.mongodb(`Created password field in ${model.collection.collectionName} collection`, false, true)
                    }, async (error) => {
                        console.mongodb(`Failed to create password field in ${model.collection.collectionName} collection`, true)
                    })
                }
            }
        }
        
        // Initialize users collection
        if (model.modelName === "users") {
            if ((await model.find({})).length == 0) {
                console.mongodb(`Missing elements in ${chalk.bold.underline("users")} collection`)
                await authAPI.create(username = "admin", password = "admin", rank = "admin");
            }
        }
    },
    hasInitialized: false,
    watchModels: async (models) => {
        models.every(async(model) => {
            await model.watch().on('change', async(data) => {
                if (data.operationType === "delete") {
                    if ((await model.find({})).length == 0) {
                        console.mongodb(`${chalk.warning(`[WARNING]`)} Every documents has been deleted in collection ${chalk.underline(data.ns.coll)}. Reloading initialization...`);
                        await module.exports.initModel(model);
                        await module.exports.watchModels([model])
                    }
                }

                if (data.operationType === "drop") {
                    console.mongodb(`${chalk.warning(`[WARNING]`)} A drop action has been detected on collection ${chalk.underline(data.ns.coll)}. Reloading database...`);
                    await module.exports.initModel(model);
                    await module.exports.watchModels([model])
                }
            });
        });
    },
    createNew: async(model, data, callback, onErr) => {
        currentData = await new model(data);
        currentData.save()
        .then(document => callback(document))
        .catch(error => onErr(error));
    }
}