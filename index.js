var mainConfig = require("./config.js");
const express = require('express'); 
const app = express(); 

app.set('view engine', 'ejs');

const server = app.listen(mainConfig.website.port, function () { 
    console.log(`Server listening to port ${mainConfig.website.port}`);
});

app.get('/', (req, res) => { 
    let data = { 
        name: 'Akashdeep', 
        hobbies: ['playing football', 'playing chess', 'cycling'] 
    } 
  
    res.render('dashboard', { data: data }); 
}); 
  

process.on('uncaughtException', function (err) {
    console.error(err);
  });