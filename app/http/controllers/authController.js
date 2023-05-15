const passport = require("passport")
const User = require("../../models/user")
const bcrypt = require('bcrypt')

function authController() {
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next){
            // The callback function is the same func we call done in register post
            // Here we will define this func now
            passport.authenticate('local', (err, user, info) => {
                // If there is some error
                if(err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                // If user is not present or null
                if(!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.loginIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req, res, next); // Returns a func which we need to call passing (req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister() {
            // Parse request body, enable express middleware to receive url data in server.js
            const {name, email, password} = req.body
            // Validate the request
            if(!name || !email || !password0) {
                // Need to show errs to the page
                // Make use of sessions to show it using the express-flash
                // to flash msgs the errs to the screen/page
                // This msg will be available for one req i.e. when we redirect and if we refresh the pg it will disappear.
                req.flash('error', 'All fields are required') // Key, value/msg
                // Now already filled data will disappear when we redirect
                // Store it inside flasg msgs and fill them again
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }
            // Check if email exists
            User.exists({email: email}, (err, result) => {
                if(result) {
                    req.flash('error', 'Email already taken')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })

            // Need users collections in DB -> created a model

            // For security we need to hash the password
            // Use bcrypt package for this and hash the password
            const hashedPassword = await bcrypt.hash(password, 10) // Make parent func async

            // Create the user after successful validation checks
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
            })

            user.save().then(() => {
                // Login
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController