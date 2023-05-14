function homeController() {
    // Factory functions (Design/Programming pattern)
    // Closures in JS
    // Creates and returns an object
    // Creating what methods in an object? Think! (All home controller logic)
    // CRUD controller (res create, upd, del, Fetch)
    return {
        // for page read naming conv to use index method
        // indx : function () {} (Below modern js way of writing same)
        index(req, res) {
            res.render('home')
        }
    }
}

module.exports = homeController