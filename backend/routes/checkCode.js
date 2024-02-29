const express = require("express")
const User = require('../models/User.js')
require('dotenv').config();

const router = express.Router();

router.post('/checkResetCode', async(req, res) => {
    try {
        const email = req.body.email;
        const typedCode = req.body.code;
        const user = await User.findOne({email: email}); 
        console.log(typedCode.length);
        if (typedCode !== user.resetToken) {
            return res.status(442).send({ error: "Sai mã đặt lại mật khẩu" });
        }
        if (new Date() > user.resetTokenExpiredDate) {
            return res.status(442).send({ error: "Mã đặt lại mật khẩu đã hết hạn" });
        }
        await user.save();
        return res.status(200).json({ success: true, message: 'Kiểm tra code thành công'});
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi xử lý đặt lại mật khẩu', error });
    }
})

module.exports = router;
