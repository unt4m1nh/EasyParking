const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Int32 } = require("mongodb");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    idUser: {
        type: String,
        default: ""
    },
    plate: {
        type: String,
        default: ""
    },
    timeCheckin: {
        type: Date
    },
    timeCheckout: {
        type: Date
    },
    status: {
        type: Number,
        default: 0
    },
    payment: {
        type: Number,
        default: 0
    },
    accountBallance: {
        type: Number,
        default: 0
    }
});

userSchema.pre('save', async function (next) {
    const user = this;
    //console.log("Just before saving", user);
    if (!user.isModified("password")) {
        return next();
    } 
    user.password = await bcrypt.hash(user.password, 8);
    console.log("Just before saving and after hashing", user);
    next();
});

// Instead of: export default User;
module.exports = mongoose.model('User', userSchema);