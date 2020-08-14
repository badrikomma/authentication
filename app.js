const express= require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app= express();

require('./config/passport')(passport);

mongoose.connect('mongodb://localhost:27017/auth');

mongoose.connection.on('connected', () => {
    console.log("Connected successfully");
});

mongoose.connection.on('error', (err) => {
    if(err) {
        console.log("Error connecting to database : " + err)
    }
    console.log("Connected successfully");
});

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT= process.env.PORT || 3000;

app.listen(PORT, console.log("Server Started Successfully on port number : " + PORT))