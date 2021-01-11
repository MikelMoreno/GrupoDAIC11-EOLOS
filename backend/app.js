var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors = require("cors");
const uuid = require('uuid').v4;
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const localAuthStrategies = require('./auth/localStrategies');
const userController = require('./controllers/userController');

var config = require('./config');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var apiRouter = require('./routes/api')

// Conexión con la base de datos
mongoose.connect(config.db_connection_string, {
    "auth": {
        "authSource": config.db_name
    },
    "user": config.express_db_user,
    "pass": config.express_db_pass,
    "useNewUrlParser": true,
    "useUnifiedTopology": true
});

// configure passport.js to use the local strategies
passport.use('local-login', localAuthStrategies.localLoginStrategy);
passport.use('local-signup', localAuthStrategies.localSignupStrategy);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    console.log('Inside deserializeUser callback')
    console.log(`The user id passport saved in the session file store is: ${id}`)

    let user = await userController.getUserById(id);

    if (user) {
        return done(null, user);
    }

    return done("No user found", false);
});

var app = express();

// Definir MongoDB como sistema de persistencia de express-session
var store = new MongoStore({
    mongooseConnection: mongoose.connection
}, (error) => console.log(error));

// Definir el middleware de las sesiones
app.use(session({
    genid: (req) => {
        return uuid()
    },
    secret: 'keyboard cat',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: true
}));

app.use(cors({ credentials: true, origin: 'http://localhost:2000' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "react-build")));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/app', indexRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.use("/*", (req, res, next) => {
    console.log("shiet")
    res.sendFile(path.join(__dirname, "react-build", "index.html"));
});

module.exports = app;

