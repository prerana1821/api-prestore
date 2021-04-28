const mongoose = require('mongoose');
const { users } = require("../data");
const { Schema } = mongoose;

const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Auth' },
  wishList: [{ productId: { type: Schema.Types.ObjectId, ref: 'Product' } }],
  cart: [{ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
  loading: "",
});

const User = mongoose.model('User', UserSchema);

const addUserToDB = () => {
  users.forEach(async (user) => {
    const NewUser = new User(user);
    const savedUser = await NewUser.save();
  })
}

module.exports = { User, addUserToDB };