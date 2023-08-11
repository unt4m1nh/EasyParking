const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes.js");
const requireToken = require("./Middlewares/AuthTokenRequired.js");
require("./db.js");

// Optional: If you want to use the mongoose package with `require`
const mongoose = require("mongoose");

// Optional: If you want to use the dotenv package with `require`
require("dotenv").config();

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(authRoutes);

app.get('/', requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/profile', requireToken, (req, res) => {
  // Access user information from req.user
  //const userId = req.user.userId;
  // Fetch user's profile from the database and send it as a response
  console.log(req.user.idUser);
  res.send(req.user);
});