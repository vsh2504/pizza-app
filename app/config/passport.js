const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy  // Class
const bcrypt = require('bcrypt')
function init() {
    // Username field can be some unique thing like we have (email, password) so email.
    passport.use(new LocalStrategy({ username: 'email'}, async (email, password, done) => {
        // Login
        // Check if email exists in the DB collection users
        const user = await User.findOne({ email: email })
        if(!user) {
            return done(null, false, { message: 'No user with this email' })
        }

        bcrypt.compare(password, user.password).then(match => {
            if(match) {
                return done(null, user, { message: 'Logged in successfully' })
            }
            return done(null, false, { message: 'Wrong username or password' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })
    }))

    // Store something in the session to see if the user is logged in or not
    // We can store anything else also if we want
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    // Recieve the stored object in session to do some manipulation acco. to its value.
    // We now get the user from the DB collection by id
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

module.exports = init;