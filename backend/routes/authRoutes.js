const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
require('dotenv').config();

const router = express.Router();

router.post('/signup', (req, res) => {
    console.log(req.body);
    const {name, email, password, phoneNumber, idUser} = req.body;
    if (!email || !password || !name || !phoneNumber || !idUser) {
       return res.status(442).send({error: "Vui lòng nhập đủ thông tin"});
    }

    User.findOne({email: email})
        .then(
            async (savedUser) => {
                if (savedUser) {
                   return res.status(442).send({error: "Email đã có người sử dụng"});
                }
                const user = new User({
                    name,
                    email,
                    password,
                    phoneNumber,
                    idUser
                })

                try {
                    await user.save();
                    const token = jwt.sign({_id: user.id}, process.env.JWT_SECRET);
                    res.send({token});
                } catch (err) {
                    console.log('db err', err);
                    return res.status(442).send({error: err.message});
                }
            }
        )
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);
    console.log(password);
    if (!email || !password) {
        return res.status(442).json({error: "Vui lòng nhập đủ thông tin đăng nhập"});
    }
    const savedUser =  await User.findOne({email: email});

    if (!savedUser) {
        return res.status(442).json({error: "Thông tin đăng nhập không chính xác"});
    }

    try {
        console.log(savedUser);
        bcrypt.compare(password, savedUser.password, (err, result) => {
            if (result) {
                const token = jwt.sign({_id: savedUser._id}, process.env.JWT_SECRET);
                res.send({token});
            } else {
                return res.status(442).json({error: "Thông tin đăng nhập không chính xác"});
            }
        })
    } catch (err) {
        console.log(err);
    }
})



module.exports = router;