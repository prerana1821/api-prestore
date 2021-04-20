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

const { users } = require("../data");

router.route("/cart/:id")
  .get((req, res) => {
    const { id } = req.params;
    console.log(id);
    const user = users.find((item) => item.id === id);
    console.log(user);
    if (user) {
      return res.status(200).json({ cart: user.cart, success: true, message: "Success" })
    } return res.status(404).json({ success: false, message: "Try again later" })
  })
  .post((req, res) => {
    const { id } = req.params;
    const newProduct = req.body;
    // console.log(newProduct);
    const user = users.find((item) => item.id === id);
    if (user) {
      const product = { ...newProduct.product, quantity: 1 }
      // console.log(product);
      user.cart.push(product);
      // console.log(user);
      // console.log(user.cart);
      return res.status(201).json({ product, success: true, message: "Successful" });
    } res.status(401).json({ success: false, message: "Try again later" })
  })

router.route("/wishlist/:id")
  .get((req, res) => {
    const { id } = req.params;
    const user = users.find((item) => item.id === id);
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