const mongoose = require('mongoose');
const { auth, users } = require("../data");
const { Schema } = mongoose;
const { User } = require("./user.model");

const AuthSchema = new Schema({
  createdAt: Number,
  updatedAt: Number,
  username: {
    type: String,
    required: [true, 'Please add your Username'],
    unique: 'Username should be unique'
  },
  email: {
    type: String,
    required: [true, 'Please enter your Email ID'],
    unique: 'EmailID should be unique'
  },
  password: {
    type: String,
    required: [true, 'Please Enter your password'],
  }
}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
  });

const Auth = mongoose.model('Auth', AuthSchema);

const addAuthToDB = () => {
  auth.forEach(async (user) => {
    const NewAuthUser = new Auth(user);
    const savedAuthUser = await NewAuthUser.save();
    console.log(savedAuthUser);
  })
  users.forEach(async (user) => {
    const NewUser = new User(user);
    const savedUser = await NewUser.save();
    console.log(savedUser)
  })
}

module.exports = { Auth, addAuthToDB };