// Represents a Table inside the DB
// Conv to have menus table inside db for menu.js
// Model (mongoose) -> Singular ; Collection (mongodb) -> Plural

const mongoose = require('mongoose')
// In JS, there is conv if var is Capital then thing stored inside is a CLass/Constructor func
const Schema = mongoose.Schema

// Call the schema constructor and pass the structure of DB collection to it when initializing
// Basically, its a class where we pass schema/blue print of our collection/table 
const menuSchema = new Schema ({
    name: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    size: {type: String, required: true},
})

// Now time to create a model using mongoose (Name of Model, schemaObject)
// Menu (mongoose) -> menus (Db)
const Menu = mongoose.model('Menu', menuSchema)

// Now, we need to export this model so that we can use it in our controllers
module.exports = Menu

// Or we can do, module.exports = mongoose.model('Menu', menuSchema)