const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const configFile = require("../config.js");

module.exports = {
    priority: 3,
    name: "Configuration file initalizer",
    code: () => {
        fs.stat(path.join(__dirname, '..', 'config.js'), async function(err, stat) {
            if (err == null) {
                Object.keys(configFile.website).forEach(entry => {
                    if (!configFile.website[entry] && typeof configFile.website[entry] !== "boolean") {
                        console.config(`${chalk.bold.underline("website." + entry)} field can't be empty or null ${chalk.grey("(check config file)")}`, true)
                        return process.exit(1);
                    }
                });
                console.config(`${chalk.green("✓")} Configuration file initialized`)
            } else if (err.code === 'ENOENT') {
                console.config(`Creating new configuration file...`)
                await fs.writeFile(path.join(__dirname, '..', 'config.js'), baseConfig, (err) => { 
                    if (err) {
                        console.config(`An error occured while creating config file...`, true)
                        console.error(err);
                    } else {
                        console.config(`New configuration file created with success`)
                    }
                }); 
            } else {
                console.error(err.code)
            }
        });
    }
};