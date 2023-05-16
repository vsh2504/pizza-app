const Order = require('../../../models/order')

function statusController() {
    return {
        update(req, res) {
            // (condn, update_value, callback fn)
            Order.updateOne({_id: req.body.orderId}, { status: req.body.status }, (err, data) => {
                if(err) {
                    // To-Do: Add error messages and render them
                    return res.redirect('/admin/orders')
                }
                // Emit event to the pvt room we created using socket
                // So that the listener can listen to event and update the status for customer/client
                // We use nodejs concept of event emitter for this inside our node app
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/admin/orders')
            })
        }
    }
}

module.exports = statusController