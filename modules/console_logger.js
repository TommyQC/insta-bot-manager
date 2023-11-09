const chalk = require("chalk");

module.exports = {
    priority: 0,
    name: "Catch console events and log it",
    code: () => {
        const realLog = console.log;
        const realClear = console.clear;
        const realErr = console.error;
        logs = [];
        errors = [];
        console.log = function() {
            if (arguments[0]) {
                logs.push([].slice.call(arguments))
            }else{
                arguments[0] = undefined;
            }
            return realLog.apply(console, arguments);
        }

        console.error = function() {
            errors.push([].slice.call(arguments))
            return realErr.apply(console, arguments);
        }

        console.clear = function() {
            logs = [];
            realClear.apply(console);
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