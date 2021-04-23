const express = require('express');
const router = express.Router();
const { Auth } = require("../models/auth.model");


// let userId = "2";
// const auth = [
//   {
//     id: "1",
//     username: "admin",
//     email: "admin@gmail.com",
//     password: "admin",
//   },
// ];

// const { auth, users } = require("../data");

const findUserByUserName = (username) => {
  return Auth.findOne({ username: new RegExp('^' + username + '$', "i") }, function(err, user) {
    if (err) return console.log(err);
    // else console.log(user.username, user.password);
  })
};

// const findUserByUserName = (username) => {
//   return auth.find((user) => user.username === username);
// };

router.get("/", async (req, res) => {
  const auth = await Auth.find({});
  res.json({ auth, success: true })
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userName = await findUserByUserName(username);
  if (userName) {
    if (userName.password && userName.password === password) {
      return res.status(200).json({ userName, success: true, message: "Login Successful" })
    } res.status(403).json({ success: false, message: "Wrong Password. Enter correct password" })
  } res.status(404).json({ success: false, message: "User not found. Check your user credentials" })
})

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const userName = await findUserByUserName(username);
  console.log(userName);
  if (userName === null) {
    try {
      console.log('HEllO');
      const NewUser = new Auth({ username, password, email });
      const savedUser = await NewUser.save();
      // const newUser = { id: String(userId++), username, password, email };
      // auth.push(newUser);
      // users.push({
      //   id: newUser.id,
      //   wishList: [],
      //   cart: [],
      //   loading: "",
      // });
      return res.status(201).json({ user: savedUser, success: true, message: "Sign Up Successful" })
    } catch (error) {
      return res.status(401).json({ success: false, message: "Error while adding user" })
    }
  } return res.status(409).json({ success: false, message: "User Already Exists" })
})

module.exports = router;