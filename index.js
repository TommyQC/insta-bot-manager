process.stdin.resume();
console.clear();

require("./modules/console_logger.js").code();
var mainConfig = require("./config.js");
const express = require('express'); 
var app = express();
const bodyParser = require("body-parser");
const chalk = require("chalk");
const cookieParser = require("cookie-parser");
const RanksDB = require("./models/ranks.js");
const UserDB = require("./models/account.js");

chalk.warning = chalk.rgb(240, 157, 34);
chalk.config = chalk.rgb(66, 117, 85);
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

app.get('/dashboard', async (req, res) => {
    app.emit("newReq", req)
    authAPI = app.modules["auth.js"];

    if (req.cookies.jwt == null || req.cookies.jwt == "") {
        res.redirect("/login");
    }

    var UserToken = await authAPI.checkToken(req.cookies.jwt);
    if (typeof UserToken == "object") {
        var rankObj = await RanksDB.find({ name: UserToken.rank });
        UserToken.rank = rankObj[0];
    }
    req.user = UserToken;
    req.currentPage = "dashboard";
  
    res.render('modernize', { req }); 
}); 

app.post("/logout", async (req, res) => { 
    app.emit("newReq", req)
    authAPI = app.modules["auth.js"];

    await authAPI.logout(res);
    res.redirect("/login");
});

const jwt = require("jsonwebtoken");

app.get('/login', async (req, res) => {

    var errors = {};
    await jwt.verify(req.cookies.jwt, mainConfig.website.jwtSecret, async (err, decodedToken) => {
        if (typeof decodedToken == "undefined" || decodedToken == null) {
            /*console.log("User is not logged in")
            console.log("type : " + typeof decodedToken)*/
        }else if (typeof decodedToken == "object"){
            /*console.log("type : " + typeof decodedToken)
            console.log("Not undefined")*/
            var rankObj = await RanksDB.find({ name: decodedToken.rank });
            decodedToken.rank = rankObj[0];
        }else{
            errors["ALERT"] = "Something wrong occured"
        }
        req.user = decodedToken;
    })

    app.emit("newReq", req)

    res.render('login', { req, res, errors, values: {}, result: {errors:errors} });
});

app.post('/login', async (req, res) => {
    authAPI = app.modules["auth.js"];

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
    mainConfig.website.logErrors ? console.error(err) : "";
});

server.on('close', function() {
    console.log(`${chalk.blueBright("[SERVER] ") + chalk.warning(`[WARNING]`)} ${chalk.bgRed(`Server stopped listening to ${chalk.bold(`http://${mainConfig.website.host}:${mainConfig.website.port}`)}`)}`);
});