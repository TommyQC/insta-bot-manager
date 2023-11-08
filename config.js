/*
|=================================================================|
|    - Desc:  Configuration file for the main website to function |
|    - Author: Tommy_QC                                           |
|=================================================================|

    -   Legend   -
    - Website: All config settings related to the website and back-end
    -   .port: The port used to deploy web server                                                   TYPE: Integer
    -   .host: The host of your web server                                                          TYPE: String
    -   .db_link: The connection link to the MongoDB database (including DB in the link)            TYPE: String
    -   .jwtSecret: Secret token used to authenticate users, generate one with                      TYPE: String
            this code: require("crypto").randomBytes(35).toString("hex")                           
    -   .logRequests: Detailed log of every request made to the WS                                  TYPE: Boolean
    -   .logErrors: Give full details of an error when it occurs                                    TYPE: Boolean
*/

module.exports = {
    website: {
        port: 80,
        host: "localhost",
        db_link: "",
        jwtSecret: "",
        logRequests: false,
        logErrors: false
    },
    bot: {
        token: ""
    }
}