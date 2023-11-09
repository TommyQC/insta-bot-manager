process.stdin.resume();
console.clear();

//require("./modules/exit_handler.js").code();
require("./modules/console_logger.js").code();
var mainConfig = require("./config.js");
const mongoose = require("mongoose");
const express = require('express'); 
var app = express();
const DB = require("./modules/db_connect.js").code;
const config = require("./models/config.js");
const bodyParser = require("body-parser");
const chalk = require("chalk");
//const authAPI = require("./modules/auth.js");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

chalk.warning = chalk.rgb(240, 157, 34);
chalk.modules = chalk.rgb(217, 132, 82);

//require("./modules/config_init.js").code();

require("./modules/init.js")(app);

app.use(express.static(__dirname + '/views'));
app.use( bodyParser.json() );                           // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));     // to support URL-encoded bodies
app.use(cookieParser());
app.set('view engine', 'ejs');

var server = app.listen(mainConfig.website.port, async function () { 
    await console.log(`${chalk.blueBright("[SERVER]")} Server listening to ${chalk.bold(`http://${mainConfig.website.host}:${mainConfig.website.port}`)}`);
});



app.get('/', async (req, res) => {
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

const jwt = require("jsonwebtoken");
const { error } = require("console");

app.get('/login', async (req, res) => {
    var errors = {};
    await jwt.verify(req.cookies.jwt, mainConfig.website.jwtSecret, (err, decodedToken) => {
        if (typeof decodedToken == "undefined" || decodedToken == null) {
            console.log("User is not logged in")
            console.log("type : " + typeof decodedToken)
        }else if (typeof decodedToken == "object"){
            console.log("type : " + typeof decodedToken)
            console.log("Not undefined")
        }else{
            errors["ALERT"] = "Something wrong occured"
        }
        req.user = decodedToken;
    })

    app.emit("newReq", req)

    res.render('login', { req, res, errors, values: {}, result: {errors:errors} });
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