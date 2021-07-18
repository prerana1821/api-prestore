const express = require('express');
const router = express.Router();
const { extend } = require("lodash");
const { User } = require("../models/user.model");
const { populateData } = require("../utils/utils")

router.get("/", async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    }
    const wholeObj = await user.populate('cart.productId').execPopulate();
    const wholeObjWish = await user.populate('wishList.productId').execPopulate();
    const object = populateData(wholeObj.cart)
    return res.status(200).json({ user: { ...user._doc, cart: object, wishList: wholeObjWish.wishList }, success: true, message: "Successful" })
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: "Error while retrieving userDetails", errorMessage: error.message })
  }
})

router.route("/cart")
  .get(async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      const wholeObj = await user.populate('cart.productId').execPopulate();
      const object = populateData(wholeObj.cart)
      return res.status(200).json({ cart: object, success: true, message: "Success" })
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while retrieving cart details", errorMessage: error.message })
    }
  })
  .post(async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);
      const productId = req.body;
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      user.cart.push({ productId: productId.id, quantity: 1 });
      const savedProduct = await user.save();
      const updatedObj = await savedProduct.populate({ path: 'cart.productId', select: 'name image price inStock offer' }).execPopulate();
      const object = populateData(updatedObj.cart)
      return res.status(201).json({ cart: object, success: true, message: "Successful" });
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while add item to cart", errorMessage: error.message })
    }
  })

router.route("/wishlist")
  .get(async (req, res) => {
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      const wholeObj = await user.populate('wishList.productId').execPopulate();
      return res.status(200).json({ wishList: wholeObj.wishList, success: true, message: "Success" })
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while retrieving wishList details", errorMessage: error.message })
    }
  })
  .post(async (req, res) => {
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      const productId = req.body;
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      user.wishList.push({ productId: productId.id });
      const savedProduct = await user.save();
      const updatedObj = await savedProduct.populate('wishList.productId').execPopulate();
      return res.status(201).json({ wishList: updatedObj.wishList, success: true, message: "Successful" });
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while add item to cart", errorMessage: error.message })
    }
  })

router.route("/cart/:productId")
  .post(async (req, res) => {
    const { productId } = req.params;
    const updateProduct = req.body;
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      const product = user.cart.find(item => item.productId == productId)
      if (!product) {
        return res.status(404).json({ success: false, errorMessage: "The product id you requested doesn't exists" })
      }
      const newProduct = extend(product, updateProduct);
      await user.save();
      return res.status(200).json({ product: newProduct, success: true, message: "Product Updated Successfully" })
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while updating cart", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    const { productId } = req.params;
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      const product = user.cart.find(item => item.productId == productId)
      if (!product) {
        return res.status(404).json({ succes: false, errorMessage: "The product id you requested doesn't exists" });
      }
      user.cart.pull({ _id: product._id });
      await user.save();
      return res.status(200).json({ cart: user.cart, success: true, message: "Successful" });
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while deleting item from cart", errorMessage: error.message })
    }
  })

router.delete("/wishlist/:productId", async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    }
    const product = user.wishList.find(item => item.productId == productId)
    if (!product) {
      return res.status(404).json({ succes: false, errorMessage: "The product id you requested doesn't exists" });
    }
    user.wishList.pull({ _id: product._id });
    await user.save();
    return res.status(200).json({ wishList: user.wishList, success: true, message: "Successful" });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: "Error while deleting item from wishList", errorMessage: error.message })
  }
})

router.route("/address")
  .get(async (req, res) => {
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      return res.status(200).json({ addresses: user.addresses, success: true, message: "Success" })
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while retrieving addresses", errorMessage: error.message })
    }
  })
  .post(async (req, res) => {
    const { newAddress } = req.body;
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      user.addresses.push(newAddress);
      const updatedUser = await user.save();
      const newAddressFromDB = updatedUser.addresses.find((item) => item.phoneNumber == newAddress.phoneNumber);
      return res.status(201).json({ address: newAddressFromDB, success: true, message: "Successful" });
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while adding address", errorMessage: error.message })
    }
  })

router.route("/address/:addressId")
  .post(async (req, res) => {
    const { addressId } = req.params;
    const updateAddress = req.body;
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      const address = user.addresses.find(item => item._id == addressId)
      if (!address) {
        return res.status(404).json({ success: false, errorMessage: "The address id you requested doesn't exists" });
      }
      const newAddress = extend(address, updateAddress.updateAddress);
      await user.save();
      return res.status(200).json({ address: newAddress, success: true, message: "Address Updated Successfully" })
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while updating address", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    const { addressId } = req.params;
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      const address = user.addresses.find(item => item._id == addressId)
      if (!address) {
        return res.status(404).json({ succes: false, errorMessage: "The address id you requested doesn't exists" });
      }
      user.addresses.pull({ _id: address._id });
      await user.save();
      return res.status(200).json({ addresses: user.addresses, success: true, message: "Successful" });
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while deleting address", errorMessage: error.message })
    }
  })

module.exports = router;