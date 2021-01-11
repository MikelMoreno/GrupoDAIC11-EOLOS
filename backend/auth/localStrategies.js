const LocalStrategy = require('passport-local').Strategy;
const userController = require('../controllers/userController');


// Define local authentication strategy for login
const localLoginStrategy = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        console.log('Inside local-login strategy callback')

        let user = await userController.getUserByEmail(email);

        if (!user) {
            console.log("no user found")
            return done(null, false, { message: "Invalid credentials" })
        }

        if (email === user.email && password === user.password) {
            console.log('Local strategy returned true')
            return done(null, user);
        } else {
            return done(null, false, { message: "Invalid credentials" });
        }
    }
);

// Define local authentication strategy for signup
const localSignupStrategy = new LocalStrategy({ 
        usernameField: 'email' ,
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        let newUser = await userController.createUser(req.body.email, password);

        if (!newUser) {
            return done(null, false, { message: "Email already in use" });
        }

        return done(null, newUser);
    }
);



module.exports.localLoginStrategy = localLoginStrategy;
module.exports.localSignupStrategy = localSignupStrategy;