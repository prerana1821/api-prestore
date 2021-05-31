const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Auth } = require("../models/auth.model");
const { User } = require("../models/user.model");

const jwtSecret = process.env['jwt-secret'];

const findUserByUserName = (username) => {
  return Auth.findOne({ username: new RegExp('^' + username + '$', "i") }, function(err, user) {
    if (err) return console.log(err);
  })
};


const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' });
}

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUserName(username);
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = generateToken(user._id);
      return res.status(200).json({ user: { ...user._doc, token }, success: true, message: "Login Successful" })
    } res.status(403).json({ success: false, errorMessage: "Wrong Password. Enter correct password" })
  } res.status(404).json({ success: false, errorMessage: "User not found. Check your user credentials" })
})

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const userName = await findUserByUserName(username);
  if (userName === null) {
    try {
      const NewUser = new Auth({ username, password, email });
      const salt = await bcrypt.genSalt(10);
      NewUser.password = await bcrypt.hash(NewUser.password, salt);
      const savedUser = await NewUser.save();
      const token = generateToken(savedUser._id);
      const NewUserDetails = new User({
        _id: NewUser._id,
        wishList: [], cart: [], addresses: []
      });
      const savedUserDetails = await NewUserDetails.save();
      return res.status(201).json({ user: { ...savedUser._doc, token }, success: true, message: "Sign Up Successful" })
    } catch (error) {
      return res.status(401).json({ success: false, errorMessage: "Error while adding user" })
    }
  } return res.status(409).json({ success: false, errorMessage: "User Already Exists" })
})

module.exports = router;