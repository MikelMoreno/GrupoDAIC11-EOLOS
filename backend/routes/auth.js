var express = require('express');
const passport = require('passport');
const { filterPassword } = require('../filters/userFilter')
const { genericError } = require('../errorHandlers/genericError')
const { updatePassword } = require('../controllers/userController')


var router = express.Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (info)  { return res.json({ error: info.message }); }
        if (err)   { return next(err); }
        if (!user) { 
            return genericError({ 
                message: "Invalid credentials"
            }, req, res, next);
        }

        req.login(user, (err) => {
            if (err) { return next(err); }
            return res.json(filterPassword(user))
        })
      })(req, res, next);
});

router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (info)  { return res.json({ error: info.message }) }
        if (err)   { return next(err) }
        if (!user) { 
            return genericError({
                message: "Could not sign up"
            }, req, res, next);
        }

        return res.json({
            user: filterPassword(user)
        });
    })(req, res, next);
});

router.get('/whoami', (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("user is authenticated")
        return res.json({
            user: filterPassword(req.user)
        });
    }

    console.log("user is NOT authenticated")
    return res.json({
        user: null
    });
})

router.get('/logout', (req, res, next) => {
    req.logout();
    res.json({
        success: true
    })
})

module.exports = router;