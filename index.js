process.stdin.resume();
console.clear();

require("./modules/exit_handler.js").code();

var mainConfig = require("./config.js");
const mongoose = require("mongoose");
const express = require('express'); 
var app = express();
const DB = require("./modules/db_connect.js").code;
const config = require("./models/config.js");
const chalk = require("chalk");
require("./modules/console_logger.js").code();

chalk.warning = chalk.rgb(240, 157, 34);

async function initialize () {
    await DB.connect();
    
    require("./modules/db_init.js").code()
    require("./modules/web_logreq.js").code(app);

    if (DB.connectionObj == undefined) {
        process.exit(1)
    }
}

initialize();

require("./modules/config_init.js").code();

app.set('view engine', 'ejs');

var server = app.listen(mainConfig.website.port, function () { 
    console.log(`${chalk.blueBright("[SERVER]")} Server listening to ${chalk.bold(`http://${mainConfig.website.host}:${mainConfig.website.port}`)}`);
});

app.get('/', (req, res) => {
    app.emit("newReq", req)

    let data = { 
        name: 'Akashdeep', 
        hobbies: ['playing football', 'playing chess', 'cycling'] 
    } 
  
    res.render('dashboard', { data: data }); 
}); 
  

process.on('uncaughtException', function (err) {
    console.error(err);
});

server.on('close', function() {
    console.log(`${chalk.blueBright("[SERVER] ") + chalk.warning(`[WARNING]`)} ${chalk.bgRed(`Server stopped listening to ${chalk.bold(`http://${mainConfig.website.host}:${mainConfig.website.port}`)}`)}`);
});