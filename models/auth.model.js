const mongoose = require('mongoose');
const { auth, users } = require("../data");
const { Schema } = mongoose;
const { User } = require("./user.model");

const AuthSchema = new Schema({
  username: String,
  email: String,
  password: String
});

const Auth = mongoose.model('Auth', AuthSchema);

const addAuthToDB = () => {
  auth.forEach(async (user) => {
    const NewAuthUser = new Auth(user);
    const savedAuthUser = await NewAuthUser.save();
  })
  users.forEach(async (user) => {
    const NewUser = new User(user);
    const savedUser = await NewUser.save();
  })
}

module.exports = { Auth, addAuthToDB };