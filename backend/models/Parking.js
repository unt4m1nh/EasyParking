const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
    nameParking: {
        type: String
    },
    address: {
        type: String
    },
    longtitude: {
        type: Number
    },
    latitude: {
        type: Number,
    },
    price: {
        type: Number,
    },
    maxSlot: {
        type: Number,
    },
    Value_emty_slot: {
        type: String,
    },
    emptySlot: {
        type: String
    },
    newArrayField: {
        type: Array
    }
}, {collection: 'parking'})

module.exports = mongoose.model('Parking', parkingSchema);