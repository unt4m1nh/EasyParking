const express = require("express")
const User = require('../models/User.js')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.post('/checkResetCode', async(req, res) => {
    try {
        const email = req.body.email;
        const typedCode = req.body.code;
        const newPassword = req.body.newPassword;
        const user = await User.findOne({email: email}); 
        console.log(user.resetToken, ' ', typedCode);
        if (typedCode !== user.resetToken) {
            //return res.status(442).send({ error: "Mã đặt lại mật khẩu không hợp lệ"});
            return console.error({ success: false, message: 'Sai mã đặt lại mật khẩu' });
        }
        if (new Date() > user.resetTokenExpiredDate) {
            return console.error({ success: false, message: 'Mã đặt lại mật khẩu đã hết hạn'})
        }
        const hashedPassword = bcrypt.hash(newPassword, 10);
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
