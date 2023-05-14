const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')

// Js objects passed by reference
function initRoutes(app) {
    // app.get('/', (req, res) => {
    //     res.render('home')
    // })

    app.get('/', homeController().index)
    app.get('/cart', cartController().index)
    app.get('/login', authController().login)
    app.get('/register', authController().register)
}

// Web.js module export it so that others can import and use it's exposed functions
module.exports = initRoutes