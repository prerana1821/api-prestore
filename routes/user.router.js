const express = require('express');
const router = express.Router();
const { extend } = require("lodash");

const { User } = require("../models/user.model");

router.get("/", async (req, res) => {
  try {
    const userDetails = await User.find({});
    res.status(200).json({ userDetails, success: true, message: "Successful" })
  } catch (error) {
    res.status(404).json({ success: false, message: "Error while retrieving products", errorMessage: error.message })
  }
})

router.route("/cart/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      const wholeObj = await user.populate('cart.productId').execPopulate();
      const object = wholeObj.cart.map((item) => {
        const { _id, productId, quantity } = item;
        return { _id, productId: { ...productId._doc, quantity } }
      })
      return res.status(200).json({ cart: object, success: true, message: "Success" })
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
    const user = await User.findById(id);
    if (user) {
      const wholeObj = await user.populate('wishList.productId').execPopulate();
      return res.status(200).json({ wishList: wholeObj.wishList, success: true, message: "Success" })
    } res.status(404).json({ success: false, message: "Try again later" })
  })
  .post(async (req, res) => {
    const { id } = req.params;
    const productId = req.body;
    const user = await User.findById(id);
    if (user) {
      user.wishList.push({ productId: productId.id });
      const savedProduct = await user.save();
      const updatedObj = await savedProduct.populate('wishList.productId').execPopulate();
      return res.status(201).json({ wishList: updatedObj.wishList, success: true, message: "Successful" });
    } res.status(401).json({ success: false, message: "Try again later" })
  })

router.route("/cart/:id/:productID")
  .post(async (req, res) => {
    const { id, productID } = req.params;
    const updateProduct = req.body;
    const user = await User.findById(id);
    if (user) {
      const product = user.cart.find(item => item.productId == productID)
      if (product) {
        let newProduct = extend(product, updateProduct);
        await user.save();
        return res.status(200).json({ product: newProduct, success: true, message: "Product Updated Successfully" })
      } return res.status(404).json({ success: false, message: "The product id you requested doesn't exists" });
    } return res.status(401).json({ success: false, message: "Try again later" })
  })
  .delete(async (req, res) => {
    const { id, productID } = req.params;
    const user = await User.findById(id);
    if (user) {
      const product = user.cart.find(item => item.productId == productID)
      if (product) {
        user.cart.pull({ _id: product._id });
        await user.save();
        return res.status(200).json({ cart: user.cart, success: true, message: "Successful" });
      } return res.status(404).json({ succes: false, message: "The product id you requested doesn't exists" });
    } return res.status(404).json({ success: false, message: "Try again later" })
  })

router.delete("/wishlist/:id/:productID", async (req, res) => {
  const { id, productID } = req.params;
  const user = await User.findById(id);
  if (user) {
    const product = user.wishList.find(item => item.productId == productID)
    if (product) {
      user.wishList.pull({ _id: product._id });
      await user.save();
      return res.status(200).json({ wishList: user.wishList, success: true, message: "Successful" });

    } return res.status(404).json({ succes: false, message: "The product id you requested doesn't exists" });
  } return res.status(404).json({ success: false, message: "Try again later" })
})

router.route("/address/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      return res.status(200).json({ addresses: user.addresses, success: true, message: "Success" })
    } res.status(404).json({ success: false, message: "Try again later" })
  })
  .post(async (req, res) => {
    const { id } = req.params;
    const newAddress = req.body;
    const user = await User.findById(id);
    if (user) {
      user.addresses.push(newAddress.newAddress);
      const updatedUser = await user.save();
      const newAddressFromDB = updatedUser.addresses.find((item) => item.phoneNumber == newAddress.newAddress.phoneNumber);
      return res.status(201).json({ address: newAddressFromDB, success: true, message: "Successful" });
    } res.status(401).json({ success: false, message: "Try again later" })
  })

router.route("/address/:id/:addressID")
  .post(async (req, res) => {
    const { id, addressID } = req.params;
    const updateAddress = req.body;
    console.log(updateAddress)
    const user = await User.findById(id);
    console.log(user);
    if (user) {
      const address = user.addresses.find(item => item._id == addressID)
      if (address) {
        let newAddress = extend(address, updateAddress.updateAddress);
        console.log(newAddress);
        await user.save();
        return res.status(200).json({ address: newAddress, success: true, message: "Address Updated Successfully" })
      } return res.status(404).json({ success: false, message: "The address id you requested doesn't exists" });
    } return res.status(401).json({ success: false, message: "Try again later" })
  })
  .delete(async (req, res) => {
    const { id, addressID } = req.params;
    const user = await User.findById(id);
    if (user) {
      const address = user.addresses.find(item => item._id == addressID)
      if (address) {
        user.addresses.pull({ _id: address._id });
        await user.save();
        return res.status(200).json({ addresses: user.addresses, success: true, message: "Successful" });
      } return res.status(404).json({ succes: false, message: "The address id you requested doesn't exists" });
    } return res.status(404).json({ success: false, message: "Try again later" })
  })

module.exports = router;