const express = require('express');
const router = express.Router();
const requireToken = require("./Middlewares/AuthTokenRequired.js");

const User = require('../models/User.js');

router.get('/profile', requireToken, async (req, res) => {

})