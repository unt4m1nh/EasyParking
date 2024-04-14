const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    idUser: {
        type: String
    },
    name: {
        type: String
    }, 
    vehicle: {
        type: String
    }, 
    parking: {
        type: String
    },
    slot: {
        type: Number
    },
    timeBooking: {
        type: String
    },
    date: {
        type: String
    },
    status: {
        type: Number
    },
    payment: {
        type: Number
    },
    paymentStatus: {
        type: Number
    }
}, {collection: 'session'})

module.exports = mongoose.model('Session', sessionSchema);