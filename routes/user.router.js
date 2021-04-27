const express = require('express');
const router = express.Router();
let productID = 400;

// const users = [
//   {
//     id: "1",
//     wishList: [],
//     cart: [],
//     loading: "",
//   },
// ]

const { User } = require("../models/user.model");
const { users } = require("../data");

// const findUserByID = (id) => {
//   return User.findById(id);
// };

router.route("/cart/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id);
    console.log(user);
    if (user) {
      return res.status(200).json({ cart: user.cart, success: true, message: "Success" })
    } return res.status(404).json({ success: false, message: "Try again later" })
  })
  .post(async (req, res) => {
    const { id } = req.params;
    const productId = req.body;
    const user = await User.findById(id);
    if (user) {
      user.cart.push({ productId: productId.id, quantity: 1 });
      const savedProduct = await user.save();
      const updatedObj = await savedProduct.populate({ path: 'cart.productId', select: 'name image price inStock offer' }).execPopulate();
      const object = updatedObj.cart.map((item) => {
        const { _id, productId, quantity } = item;
        return { _id, productId: { ...productId._doc, quantity } }
      })
      return res.status(201).json({ cart: object, success: true, message: "Successful" });
    } res.status(401).json({ success: false, message: "Try again later" })
  })

router.route("/wishlist/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id);
    console.log(user);
    if (user) {
      return res.status(200).json({ wishList: user.wishList, success: true, message: "Success" })
    } res.status(404).json({ success: false, message: "Try again later" })
  })
  .post((req, res) => {
    const { id } = req.params;
    const product = req.body;
    console.log(product);
    const user = users.find((item) => item.id === id);
    console.log(user);
    if (user) {
      user.wishList.push(product.product);
      console.log(user);
      console.log(user.wishList);
      return res.status(201).json({ product, success: true, message: "Successful" });
    } res.status(401).json({ success: false, message: "Try again later" })
  })

router.route("/cart/:id/:productId")
  .post((req, res) => {
    const { id, productId } = req.params;
    console.log(id)
    console.log(productId)
    const updateProduct = req.body;
    console.log(updateProduct)
    const user = users.find((item) => item.id === id);
    console.log(user)
    if (user) {
      const product = user.cart.find(item => item.id === productId);
      console.log(product);
      if (product) {
        Object.keys(updateProduct).forEach((key) => {
          if (key in product) {
            product[key] = updateProduct[key];
          }
        })
        console.log(user)
        return res.status(200).json({ product, success: true, message: "Product Updated Successfully" })
      } return res.status(404).json({ success: false, message: "The product id you requested doesn't exists" });
    } return res.status(401).json({ success: false, message: "Try again later" })
  })
  .delete((req, res) => {
    const { id, productId } = req.params;
    const user = users.find((item) => item.id === id);
    if (user) {
      const product = user.cart.find(item => item.id === productId)
      if (product) {
        var index = user.cart.findIndex(function(item) {
          return item.id === productId;
        })
        if (index !== -1) {
          user.cart.splice(index, 1);
          return res.status(200).json({ cart: user.cart, success: true, message: "Successful" });
        }
      } return res.status(404).json({ succes: false, message: "The product id you requested doesn't exists" });
    } return res.status(404).json({ success: false, message: "Try again later" })
  })

router.delete("/wishlist/:id/:productId", (req, res) => {
  const { id, productId } = req.params;
  console.log(id)
  console.log(productId)
  const user = users.find((item) => item.id === id)
  console.log(user)
  if (user) {
    const product = user.wishList.find(item => item.id === productId)
    console.log(product);
    if (product) {
      console.log('Hello', product);
      var index = user.wishList.findIndex(function(item) {
        return item.id === productId;
      })
      if (index !== -1) {
        user.wishList.splice(index, 1);
        console.log(user.wishList);
        return res.status(200).json({ wishList: user.wishList, success: true, message: "Successful" });
      }
    } return res.status(404).json({ succes: false, message: "The product id you requested doesn't exists" });
  } return res.status(404).json({ success: false, message: "Try again later" })
})

module.exports = router;