const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env['jwt-secret'];
const { Auth } = require('../models/auth.model')

const findUserByUserName = (username) => {
  return Auth.findOne({ username: new RegExp('^' + username + '$', "i") }, function(err, user) {
    if (err) return console.log(err);
  })
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

const populateData = (cart) => {
  return cart.map((item) => {
    const { _id, productId, quantity } = item;
    return { _id, productId: { ...productId._doc, quantity } }
  });
}

module.exports = { findUserByUserName, generateToken,populateData }