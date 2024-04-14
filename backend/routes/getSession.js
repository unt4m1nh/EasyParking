const express = require("express")
const Session = require('../models/Session.js')
require('dotenv').config();

const router = express.Router();

router.get('/getSession/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const session = await Session.findOne({idUser: id, status: 1}); 
        console.log(session);
    
        return res.status(200).json(session);
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi tải thông tin đặt chỗ', error });
    }
})

router.get('/getAllSession/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const session = await Session.find({idUser: id, status: 0}); 
        console.log(session);
    
        return res.status(200).json(session);
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi tải lịch sử đỗ xe', error });
    }
})

module.exports = router;
