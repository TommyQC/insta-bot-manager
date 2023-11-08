process.stdin.resume();
console.clear();

require("./modules/exit_handler.js").code();

var mainConfig = require("./config.js");
const mongoose = require("mongoose");
const express = require('express'); 
var app = express();
const DB = require("./modules/db_connect.js").code;
const config = require("./models/config.js");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const authAPI = require("./modules/auth.js");
const cookieParser = require("cookie-parser");
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

app.use(express.static(__dirname + '/views'));
app.use( bodyParser.json() );                           // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));     // to support URL-encoded bodies
app.use(cookieParser());
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

app.get('/1', (req, res) => {
    app.emit("newReq", req)

    let data = { 
        name: 'Akashdeep', 
        hobbies: ['playing football', 'playing chess', 'cycling'] 
    } 
  
    res.render('modernize', { data: data }); 
}); 


app.get('/login', (req, res) => {
    app.emit("newReq", req)

    res.render('login', { req, res, errors, values: {}, result: {errors:{}} });
});

app.post('/login', async (req, res) => {
    app.emit("newReq", req)
    console.log("Just got post request")

    var errors = {};
    var values = {};
    var username =  req.body.userInput;
    var password = req.body.passInput;
    
    if (!username || username == "") {
        errors["usernameInput"] = "Username is empty";
    }

    if (!password || password == "") {
        errors["passwordInput"] = "Password is empty";
    }

    values["usernameInput"] = req.body.userInput;
    values["passwordInput"] = req.body.passInput;

    res.render('login', { req, res, errors, values, result: await authAPI.login(username, password, ["usernameInput", "passwordInput"], res) });
}); 
  

process.on('uncaughtException', function (err) {
    console.error(err);
});

server.on('close', function() {
    console.log(`${chalk.blueBright("[SERVER] ") + chalk.warning(`[WARNING]`)} ${chalk.bgRed(`Server stopped listening to ${chalk.bold(`http://${mainConfig.website.host}:${mainConfig.website.port}`)}`)}`);
});