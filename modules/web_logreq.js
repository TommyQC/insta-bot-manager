const chalk = require("chalk");

module.exports = {
    name: "Log web requests function",
    code: (app) => {
        app.on('newReq', function (req) {
            if (require("../config.js").website.logRequests) {
                console.log(`${chalk.magenta("[REQUEST]")} ${chalk.bold(req.method)} request on ${chalk.bold(req.originalUrl)} ${req.ip !== undefined ? `from IP ${chalk.bold(req.ip)}` : ""} ${Object.keys(req.query).length !== 0 ? `with following queries;${chalk.bold(Object.entries(req.query).map(([key, value]) => ` ${key}: ${value}`))}`: ""}`)
            }
        });
    }
}