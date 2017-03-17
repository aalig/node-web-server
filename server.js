const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.port || 3000;

// Make a new express app
// 'views' is the defalut directory express uses for your templates
var app = express();

hbs.registerPartials(__dirname + '/views/partial');
app.set('view engine', 'hbs');

// Registering a new express middleware (In the below example for logging)
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
           console.log('Unable to append to server.log.');
        }
    });
    next(); // Unless this method is called the routing won't work
});

// Since we are not calling next(), this will always render the maintenance page
// and no other middleware will be executed
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

// Serve a static webpage by registering express middleware (i.e. app.use to add new middleware)
app.use(express.static(__dirname + '/public')); // For rendering static web page

// Registering a helper for partial templating
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

// Setup all http route hanlders (i.e. Dynamic routes)
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: "Welocome to our home page",
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

// Bind the application to a port on the machine
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});