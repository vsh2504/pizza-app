const Order = require('../../../models/order')

function orderController() {
    return {
        index(req, res) {
           order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
                // If AJAX call using axios from initAdmin from admin.js  
                // Check if "XMLHttpRequest" 
                if(req.xhr) {
                    // return the data to axios call in form of json
                    return res.json(orders)
                } else {
                    // When GET request render the view
                    return res.render('admin/orders')
                }
           })
        }
    }
}

module.exports = orderController