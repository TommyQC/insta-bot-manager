const chalk = require("chalk");

module.exports = {
    name: "Catch console events and log it",
    code: () => {
        const realConsole = console;
        logs = [];
        errors = [];
        console.log = function() {
            logs.push([].slice.call(arguments))
            return realConsole.log.apply(console, arguments);
        }

        console.error = function() {
            errors.push([].slice.call(arguments))
            return realConsole.error.apply(console, arguments);
        }

        console.clear = function() {
            logs = [];
            realConsole.clear.apply(console);
            setTimeout(() => {
                if (errors.length != 0) {
                    console.info(`${chalk.red("[ERROR]")} Some errors occured: `)
                    errors.forEach(element => {
                        console.info(element[0])
                    });
                    errors = [];
                }
            }, 1000);
            return;
        }

        console.getLogs = function() {
            return logs;
        }
    }
}