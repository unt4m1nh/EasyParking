const express = require("express")
const User = require('../models/User.js')
require('dotenv').config();

const router = express.Router();

router.post('/resetPassword', async(req, res) => {
    try {
        const email = req.body.email;
        const newPassword = req.body.newPassword;
        const user = await User.findOne({email: email}); 
        user.password = newPassword;
        user.resetToken = "";
        user.resetTokenExpiredDate = null;
        await user.save();
        res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công'})
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xử lý đặt lại mật khẩu', error });
    }
})

module.exports = router;
