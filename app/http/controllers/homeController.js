// Need the model for menu
const Menu = require('../../models/menu')

function homeController() {
    // Factory functions (Design/Programming pattern)
    // Closures in JS
    // Creates and returns an object
    // Creating what methods in an object? Think! (All home controller logic)
    // CRUD controller (res create, upd, del, Fetch)
    return {
        // for page read naming conv to use index method
        // indx : function () {} (Below modern js way of writing same)
        async index(req, res) {
            // fetch objects from collections and render onto home page
            // Find all objects from db
            // Normal method
            // Menu.find().then(function(pizzas) {
            //     console.log(pizzas)
            //     return res.render('home', { pizzas: pizzas })
            // })

            // To use await we need to make the func we keep it inside or parent func async
            const pizzas = await Menu.find()
            console.log(pizzas)
            return res.render('home', { pizzas: pizzas })
        }
    }
}

module.exports = homeController