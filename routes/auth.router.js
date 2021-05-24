const express = require('express');
const router = express.Router();
const { Auth } = require("../models/auth.model");
const { User } = require("../models/user.model");

const findUserByUserName = (username) => {
  return Auth.findOne({ username: new RegExp('^' + username + '$', "i") }, function(err, user) {
    if (err) return console.log(err);
  })
};

router.get("/", async (req, res) => {
  const auth = await Auth.find({});
  res.json({ auth, success: true })
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUserName(username);
  if (user) {
    if (user.password && user.password === password) {
      return res.status(200).json({ user, success: true, message: "Login Successful" })
    } res.status(403).json({ success: false, message: "Wrong Password. Enter correct password" })
  } res.status(404).json({ success: false, message: "User not found. Check your user credentials" })
})

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const userName = await findUserByUserName(username);
  if (userName === null) {
    try {
      const NewUser = new Auth({ username, password, email });
      const savedUser = await NewUser.save();
      const NewUserDetails = new User({
        _id: NewUser._id,
        wishList: [], cart: [], addresses: []
      });
      const savedUserDetails = await NewUserDetails.save();
      console.log(savedUserDetails);
      return res.status(201).json({ user: savedUser, success: true, message: "Sign Up Successful" })
    } catch (error) {
      return res.status(401).json({ success: false, message: "Error while adding user" })
    }
  } return res.status(409).json({ success: false, message: "User Already Exists" })
})

module.exports = router;