const express = require('express');
const router = express.Router();

let userId = "2";
// const auth = [
//   {
//     id: "1",
//     username: "admin",
//     email: "admin@gmail.com",
//     password: "admin",
//   },
// ];

const { auth, users } = require("../data");

const findUserByUserName = (username) => {
  return auth.find((user) => user.username === username);
};

router.get("/", (req, res) => {
  res.json({ auth, success: true })
})

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const userName = findUserByUserName(username);
  if (userName) {
    if (userName.password && userName.password === password) {
      return res.status(200).json({ userName, success: true, message: "Login Successful" })
    } res.status(403).json({ success: false, message: "Wrong Password. Enter correct password" })
  } res.status(404).json({ success: false, message: "User not found. Check your user credentials" })
})

router.post("/signup", (req, res) => {
  const { username, password, email } = req.body;
  const userName = findUserByUserName(username);
  if (!userName) {
    const newUser = { id: String(userId++), username, password, email };
    auth.push(newUser);
    users.push({
      id: newUser.id,
      wishList: [],
      cart: [],
      loading: "",
    });
    return res.status(201).json({ user: newUser, success: true, message: "Sign Up Successful" })
  } return res.status(409).json({ success: false, message: "User Already Exists" })
})

module.exports = router;