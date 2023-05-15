// Represents a Table inside the DB
// Conv to have menus table inside db for menu.js
// Model (mongoose) -> Singular ; Collection (mongodb) -> Plural

const mongoose = require('mongoose')
// In JS, there is conv if var is Capital then thing stored inside is a CLass/Constructor func
const Schema = mongoose.Schema

// Call the schema constructor and pass the structure of DB collection to it when initializing
// Basically, its a class where we pass schema/blue print of our collection/table 
// Admin will be created manually in the DB for security and don't expose role to customer reg pg
const userSchema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: 'customer'},
}, {timestamps: true})

// Now time to create a model using mongoose (Name of Model, schemaObject)
// User (mongoose) -> users (Db)
// Now, we need to export this model so that we can use it in our controllers
// Or we can do, module.exports = mongoose.model('User', userSchema)
module.exports = mongoose.model('User', userSchema)

