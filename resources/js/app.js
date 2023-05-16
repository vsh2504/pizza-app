import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
    // Ajax call -> we can use fetch api of js
    // We can use axios, very powerful library used for prod websites
    // Post request to send data
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false,
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
        console.log(pizza)
    })
})

// Remove alert message after X seconds 
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

// Change order status 
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    // Clear the class for previous rendered outputs and reset it
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    // Identify the step which is been update in database for status
    // Add classes accordingly
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            // Add the step-completed class to all the steps until we find the current one
            status.classList.add('step-completed')
       } 
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            // Add the current class to the next action to the completed one
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
       }   
    })

}

updateStatus(order);

// Socket 
let socket = io()

// Join event emit over pvt room
if(order) {
    socket.emit('join', `order_${order._id}`)
}

// Update the order for admin in real time
let adminAreaPath = window.location.pathname // Get the current url path 
// console.log(adminAreaPath)

// No unique room needed here like for orders
// One admin room is sufficient
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

// Listed for the event emitted over the pvt room over socket
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order } // Copy of order
    // Update the time of update and status
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    // Use the helper func to update the actual html page
    updateStatus(updatedOrder)
    // Notify the update using success msg box
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})