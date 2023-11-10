const bcrypt = require("bcryptjs")
const config = require("../config.js")
const UserDB = require("../models/account.js");
const RanksDB = require("../models/ranks.js");
const chalk = require("chalk")
const jwt = require('jsonwebtoken')
const jwtSecret = config.website.jwtSecret;

module.exports = {
    priority: 9,
    name: "Authentification module",
    login: async (username, password, ids, res) => {
        var errors = {};
        var inputForm = {};
        inputForm[ids[0]] = username;
        inputForm[ids[1]] = password;

        if ((Object.keys(errors).length === 0 && errors.constructor === Object) && (username && password)) {
            try {
                const user = await UserDB.model.findOne({ username });
                if (!user) {
                    errors[ids[0]] = "This username was not found";
                }else{
                    await bcrypt.compare(password, user.password).then(async (result) => {
                        if (result == false) {
                            errors[ids[1]] = "Password is incorrect";
                        }else{
                            const maxAge = 3 * 60 * 60;
                            const token = jwt.sign(
                                { 
                                    id: user._id, 
                                    username, 
                                    rank: user.rank,
                                    img: user.picture
                                },
                                jwtSecret,
                                {
                                    expiresIn: maxAge, // 3hrs in sec
                                }
                            );
                            res.cookie("jwt", token, {
                                httpOnly: true,
                                maxAge: maxAge * 1000, // 3hrs in ms
                            });
                            inputForm["response"] = "success";
                            console.log(`${chalk.magenta("[REQUEST]")} Successfull login request on account ${chalk.bold(username)}.`)
                        }                        
                    })
                }
            } catch(error) {
                var currentError = error.msg;
                if (error.errmsg === undefined || error.errmsgmsg == null || error.errmsg == "undefined")
                    currentError = error.message

                errors["ALERT"] = "Something wrong occured.";
                console.log(`${chalk.magenta("[REQUEST]")} ${chalk.red("[ERROR]")} Something wrong occured when trying to log in; ${chalk.red.bold(currentError)}`)
                config.website.logErrors ? console.error(error) : "";
            }
        }
        if (Object.keys(errors).length != 0) {
            inputForm["response"] = "error";
        }
        inputForm.errors = await errors;
        return await inputForm;
    },
    logout: async (res) => {
        res.cookie("jwt", "", { maxAge: 1 });
        console.log(`${chalk.magenta("[REQUEST]")} Successfull logout request.`)
    },
    create: async(username, password, rank) => {
        bcrypt.hash(password, 10).then(async (hash) => {
            await UserDB.model.create({
                username: username,
                password: hash,
                rank: rank
            }).then((newUser) => {
                console.log(`${chalk.green.bold("[MONGODB] +")} New account created; ${chalk.bold(`(user: ${newUser.username}, password: ${password}, rank: ${rank})`)}.`)
            }).catch((error) => {
                console.log(`${chalk.green("[MONGODB]")} ${chalk.red("[ERROR]")} Failed to create account in database.`);
                config.website.logErrors ? console.error(error) : "";
            })
        }).catch((error) => {
            console.log(`${chalk.red("[ENCRYPTION]")} Password failed to hash, aborted account creation.`);
            config.website.logErrors ? console.error(error) : "";
        });
    },
    checkToken: async(cookie) => {
        return await jwt.verify(cookie, config.website.jwtSecret);
        /*await jwt.verify(cookie, config.website.jwtSecret, async (err, decodedToken) => {
            if (typeof decodedToken == "undefined" || decodedToken == null) {
                /*console.log("User is not logged in")
                console.log("type : " + typeof decodedToken)
            }else if (typeof decodedToken == "object"){
                /*console.log("type : " + typeof decodedToken)
                console.log("Not undefined")
                var rankObj = await RanksDB.find({ name: decodedToken.rank });
                decodedToken.rank = rankObj[0];
            }else{
                return "Something wrong occured";
            }
            return await decodedToken;
        })*/
    }
}