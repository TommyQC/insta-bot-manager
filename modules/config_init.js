const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

module.exports = {
    priority: 3,
    name: "Configuration file initalizer",
    code: () => {
        fs.stat(path.join(__dirname, '..', 'config.js'), async function(err, stat) {
            if (err == null) {
                console.log(`${chalk.cyan("[CONFIG]")} Configuration file initialized`)
            } else if (err.code === 'ENOENT') {
                console.log(`${chalk.cyan("[CONFIG]")} Creating new configuration file...`)
                await fs.writeFile(path.join(__dirname, '..', 'config.js'), baseConfig, (err) => { 
                    if (err) {
                        console.log(`${chalk.red("[ERROR]")} ${chalk.cyan("[CONFIG]")} An error occured while creating config file...`)
                        console.error(err);
                    } else {
                        console.log(`${chalk.cyan("[CONFIG]")} New configuration file created with success`)
                    }
                }); 
            } else {
                console.error(err.code)
            }
        });
    }
};