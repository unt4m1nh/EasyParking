const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User.js");

module.exports = requireToken = (req, res, next) => {
    console.log(req.headers);
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: "You must be logged in, key is not given" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in, invalid token" });
        }

        const { _id } = payload;
        User.findById(_id).then(userdata => {
            req.user = userdata;
            next();
        })
    });
}
