const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const DB = require("./db_connect.js").code;

module.exports = async (app) => {
    fileNumber = 0;

    await DB.connect();

    console.log(`${chalk.modules("[MODULES] ▶")} Loading modules`);

    writeLog = function(array) {
        console.clear()

        Object.entries(array).forEach(entry => {
            const [key, value] = entry;

            console.log(value[0]);
        });
    }

    app.modules = [];

    fs.readdir(path.join(__dirname, ''), async (err, files) => {
        if (err) {
            console.log(`${chalk.modules("[MODULES]")} ${chalk.red("[ERROR]")} An error occured while trying to load modules. ${err.errmsg !== undefined ? chalk.bold.red(err.errmsg) : chalk.bold.red(err.message)}`)
            return mainConfig.website.logErrors ? console.error(err) : "";
        }

        files = files.filter((x) => x !== "init.js" && x !== "console_logger.js" && x !== "db_connect.js");

        files.forEach((file) => {
            app.modules[file] = require(`./${file}`)
            app.modules[file].callName = file.replace(".js", "");
        })

        app.modules = Object.fromEntries(Object.entries(app.modules).sort((x, y) => x[1].priority - y[1].priority));

        i = 0;
        for (const [key, value] of Object.entries(app.modules)) {
            i++
            plugin = require(`./${key}`);

            typeof plugin.code == "function" ? plugin.code(app) : plugin.code;
                
            console.log(`${chalk.modules("[MODULES]")} Loaded module ${value.callName}`)

            currentModule = module.children.find((element) => element.id === path.join(__dirname, key));

            if (i == Object.keys(app.modules).length) {
                var currentLogs = await console.getLogs();
                writeLog(currentLogs.filter(([key, value]) => !key.includes("[MODULES]")))

                console.log(`${chalk.modules("[MODULES] ") + chalk.green("✓")} ${i}/${Object.keys(app.modules).length} modules loaded successfully.`)
            }
        }
    })

    return app.modules;
}