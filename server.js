const express = require("express")
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')

// Might be possible that 3300 port not available on server where
// will host the project so we will define it in env var, else 3300
const PORT = process.env.PORT || 3300

// Assets -> so that css files rel path gets served correctly (not as text/html)
// static func is like a middleware
app.use(express.static('public'))

// Set Template engine
app.use(expressLayout)
// Tell express where views are stored
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// Define routes after setting up ejs and expressLayout
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/cart', (req, res) =>{
    res.render('customers/cart')
})

app.get('/login', (req, res) => {
    res.render('auth/login')
})

app.get('/register', (req, res) => {
    res.render('auth/register')
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})