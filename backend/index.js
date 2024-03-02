const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes.js");
const sendMail = require("./routes/sendVerificationEmail.js");
const checkCode = require("./routes/checkCode.js");
const resetPassword = require("./routes/resetPassword.js");
const requireToken = require("./Middlewares/AuthTokenRequired.js");
const Parking = require('./models/Parking.js')
require("./db.js");

//Write file module
const fs = require('fs-extra');

// Optional: If you want to use the mongoose package with `require`
const mongoose = require("mongoose");
const User = require("./models/User.js");

// Optional: If you want to use the dotenv package with `require`
require("dotenv").config();

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(sendMail);
app.use(checkCode);
app.use(resetPassword);

app.get('/', requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Get user's profile
app.get('/profile', requireToken, (req, res) => {
  console.log(req.user.idUser);
  res.send(req.user);
});

//Get full parking list
app.get('/parking', async (req, res) => {
  try {
    const parkingList = await Parking.find(); //
    await fs.writeJSON('data.json', parkingList);
    res.json(parkingList);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi tìm kiếm bãi xe' });
  }
});

//Update user info
app.patch('/update/:id',  async (req, res) => {
  const {name, email, plate, phoneNumber} = req.body;
  console.log(name, email, plate, phoneNumber);
  if (!name || !email || !plate || !phoneNumber) {
    return res.status(442).send({error: "Vui lòng nhập đủ thông tin"});
  }
  
  try {
    const userId = req.params.id;
    await User.findOneAndUpdate({idUser: userId}, req.body, {new: true});
    return res.status(200).send({message: "Cập nhật thông tin tài khoản thành công"});
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ error: 'Có lỗi xảy ra trong quá trình cập nhật thông tin người dùng' });
  }
});

// In development adding cash function
app.patch('/add_cash/:id',  async (req, res) => {
  const {amount} = req.body;

  try {
    const userId = req.params.id;
    const user = await User.findOneAndUpdate({_id: userId}, req.body, {new: true});
    console.log(user)
    res.json({user});
  } catch (error) {
    res.status(500).json({ error: 'Có lỗi xảy ra trong quá trình cập nhật thông tin người dùng' });
  }
});

// Add Slots for all records in Parking schema
app.patch('/add_slots_props', async (req, res) => {
  try {
    const parkingList = await Parking.find();
    console.log(parkingList);
    for (let i = 0; i < parkingList.length; i++) {
      const slots = [];
      for (let j = 0; j < parkingList[i].maxSlot; j++) {
        slots.push({
          "slot": `${j + 1}`,
          "status": 0
        })
      }
      console.log(parkingList[i].nameParking);
      await Parking.updateOne({nameParking: parkingList[i].nameParking}, {$set:{ SlotStatus: slots}});
    }
    res.status(500).json({success: true, message: "Thêm trường Slots thành công"});
  } catch (err) {
    res.status(422).json({error: 'Lỗi hệ thống bãi xe: ' + err})
  }
})