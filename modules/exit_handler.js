const chalk = require("chalk");

module.exports = {
    name: "Handler when application is closing",
    code: () => {
        function exitHandler(options, exitCode) {
            if (options.exit) {
                process.exit();
            }
            return console.log(`${chalk.yellow(`[WARNING]`)} Exiting program...`);
        }
        
        // do something when app is closing
        process.on('exit', exitHandler.bind(null, {
                cleanup: true
            }
        ));
        
        // catches ctrl+c event
        process.on('SIGINT', exitHandler.bind(null, {
                exit: true
            }
        ));
        
        // catches "kill pid" (for example: nodemon restart)
        process.on('SIGUSR1', exitHandler.bind(null, {
                exit:true
            }
        ));

        process.on('SIGUSR2', exitHandler.bind(null, {
                exit:true
            }
        ));
        
        // catches uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.log(`${chalk.red("[ERROR]")} An error occured`)
            return console.error(error)
        });
    }
}