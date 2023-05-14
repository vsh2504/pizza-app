const express = require("express")
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')

// Might be possible that 3000 port not available on server where
// will host the project so we will define it in env var, else 3000
const PORT = process.env.PORT || 3000

// Define routes
app.get('/', (req, res) => {
    res.render('home')
})

// Set Template engine
app.use(expressLayout)
// Tell express where views are stored
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})