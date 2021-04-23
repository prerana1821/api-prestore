const mongoose = require('mongoose');
const { auth } = require("../data");
const { Schema } = mongoose;

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
    console.log(savedAuthUser);
  })
}

module.exports = { Auth, addAuthToDB };