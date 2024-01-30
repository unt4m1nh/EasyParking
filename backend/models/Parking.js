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
    emptySlot: {
        type: String,
    },
    SlotStatus: {
        type: Array,
    }
}, {collection: 'parking'})

module.exports = mongoose.model('Parking', parkingSchema);