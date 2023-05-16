require('dotenv').config()
const express = require("express")
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
const Emitter = require('events')

// Might be possible that 3300 port not available on server where
// will host the project so we will define it in env var, else 3300
const PORT = process.env.PORT || 3300

// DB Connection
const url = 'mongodb://localhost/pizza';
// Pass url and mongodb config
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiesTopology: true, useFindAndModify : true});
// Store connection in a var to use it later
const connection = mongoose.connection;
// Event listener for open type, if DB connected then event is called which basically logs DB conn else if err..
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});

// Session store
// We need to pass the conn for which db we want to store
// collection inside the db we want to create
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

// Event emitter 
// Works on pub-sub arch
// We can emit event in one place of our app
// and listen for it in another part of our app
// E.g. after registering send user the email for registering through another part of our express app
const eventEmitter = new Emitter()
// To use this eventEmitter inside the statusController we need to bind it to our app
app.set('eventEmitter', eventEmitter)

// Session config
// express-session runs as a middleware
app.use(session({
    // secret needed for encrypting the cookies
    // Sessions can't work w/o cookies
    // Secrets are stored outside into the nodes and our apps can only access it
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hr cookie life
}))

// Passport config
// Initialize the strategy
const passportInit = require('./app/config/passport')
passportInit(passport)
// Add express to use passport as a middleware
app.use(passport.initialize())      
app.use(passport.session())         // Passport works with the help of sessions so init it after init session config

// By default server will store the session in its memory if not configured
app.use(flash())

// Assets -> so that css files rel path gets served correctly (not as text/html)
// static func is like a middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Global middleware
// Mounting the session in response so ejs can use it
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// Set Template engine
app.use(expressLayout)
// Tell express where views are stored
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// Define routes after setting up ejs and expressLayout
require('./routes/web')(app)

const server = app.listen(PORT, () => {
                    console.log(`Listening on port ${PORT}`)
                })

// Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // Use private rooms
    // For each order there is one pvt room -> we want to notify abt the event the specific order & not all
    // When status changes for a particular order we will emit the event in the pvt room
    // We will listen for the event and update the status
    // Look for Join event emitted. Get orderId from the app.js event which is the room id 
    socket.on('join', (orderId) => {
        // Join the room created by the orderId
        // Basically, it is connecting to the socket using orderId created inside app.js
        socket.join(orderId)
    })
})

// Listen for emitted event
// emit the event to the pvt unique room for that orderId
eventEmitter.on('orderUpdated', (data) => {
    // event emitted by the name 'orderUpdated'
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

// For populating admin dashboard in realtime
// Listen for app event sent from customers/orderController.js
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})