const Order = require('../../../models/order')
const moment = require('moment')

function orderController () {
    return {
        store(req, res) {
            // Validate request 
            const { phone, address } = req.body
            if(!phone || !address) {
                req.flash('error', 'All fields are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    req.flash('success', 'Order placed successfully')
                    delete req.session.cart
                    // Emit the event for app to listen
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder) 
                    return res.redirect('/customer/orders')
                })
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, 
                                            null, 
                                            { sort: { 'createdAt': -1 } } )
            // This is done to avoid getting "Order placed" notification even after going back agan to order page
            // This says not to retain any cache related to this page for subsequent coming back to this page
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user to only allow users to access orders which are their own
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return res.redirect('/')
        }
    }
}

module.exports = orderController