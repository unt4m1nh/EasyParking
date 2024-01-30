const express = require("express")
const nodemailer = require("nodemailer");
const User = require('../models/User.js')
require('dotenv').config();

const router = express.Router();

function generateRandomString(length) {
    const characters = '0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

router.post('/sendResetPassword', async (req, res) => {
    try {
        //Generate reset token
        const email = req.body.email;
        const existedUser = await User.findOne({ email: email });

        if (!existedUser) {
            console.error({ success: false, message: 'Email is not existed' });
            return res.status(442).send({ error: "Email đăng ký tài khoản không tồn tại" });
        }

        const resetToken = generateRandomString(6);
        const resetTokenExpiredDate = Date.now() + 3000000;
        console.log(resetToken);
        await User.updateOne({email: email}, {$set: {resetToken: resetToken, resetTokenExpiredDate: resetTokenExpiredDate }});
        res.send({ existedUser });
        //Settings for sending mail 
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASSWORD,
            }
        });
        var mailOptions = {
            from: 'EasyParking',
            to: 'giaminh5567@gmail.com',
            subject: 'Easy Parking account password reset code',
            text: 'Verification',
            html: `<p>Your reset password code is ${resetToken}`
        }
        await transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Mail sent ' + info.response);
                res.json({ 'Message': 'Mail sent' + info.response });
            }
        })
    } catch (error) {
        console.log('db err', error);
        return res.status(442).send({ error: error.message });
    }
    //Send mail

}
)

module.exports = router;