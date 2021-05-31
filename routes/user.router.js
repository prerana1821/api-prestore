const express = require('express');
const router = express.Router();
const { extend } = require("lodash");
const { User } = require("../models/user.model");

router.param("id", async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ success: false, errorMessage: "unable to send user" })
  }
})

router.get("/", async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      const wholeObj = await user.populate('cart.productId').execPopulate();
      const wholeObjWish = await user.populate('wishList.productId').execPopulate();
      const object = wholeObj.cart.map((item) => {
        const { _id, productId, quantity } = item;
        return { _id, productId: { ...productId._doc, quantity } }
      })
      res.status(200).json({ user: { ...user._doc, cart: object, wishList: wholeObjWish.wishList }, success: true, message: "Successful" })
    }
  } catch (error) {
    res.status(404).json({ success: false, errorMessage: "Error while retrieving userDetails", errorMessage: error.message })
  }
})

router.route("/cart")
  .get(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      const wholeObj = await user.populate('cart.productId').execPopulate();
      const object = wholeObj.cart.map((item) => {
        const { _id, productId, quantity } = item;
        return { _id, productId: { ...productId._doc, quantity } }
      })
      return res.status(200).json({ cart: object, success: true, message: "Success" })
    }
  })
  .post(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    const productId = req.body;
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      user.cart.push({ productId: productId.id, quantity: 1 });
      const savedProduct = await user.save();
      const updatedObj = await savedProduct.populate({ path: 'cart.productId', select: 'name image price inStock offer' }).execPopulate();
      const object = updatedObj.cart.map((item) => {
        const { _id, productId, quantity } = item;
        return { _id, productId: { ...productId._doc, quantity } }
      });
      return res.status(201).json({ cart: object, success: true, message: "Successful" });
    }
  })

router.route("/wishlist")
  .get(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      const wholeObj = await user.populate('wishList.productId').execPopulate();
      return res.status(200).json({ wishList: wholeObj.wishList, success: true, message: "Success" })
    }
  })
  .post(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    const productId = req.body;
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      user.wishList.push({ productId: productId.id });
      const savedProduct = await user.save();
      const updatedObj = await savedProduct.populate('wishList.productId').execPopulate();
      return res.status(201).json({ wishList: updatedObj.wishList, success: true, message: "Successful" });
    }
  })

router.route("/cart/:productId")
  .post(async (req, res) => {
    const { productId } = req.params;
    const updateProduct = req.body;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      const product = user.cart.find(item => item.productId == productId)
      if (product) {
        let newProduct = extend(product, updateProduct);
        await user.save();
        return res.status(200).json({ product: newProduct, success: true, message: "Product Updated Successfully" })
      } return res.status(404).json({ success: false, errorMessage: "The product id you requested doesn't exists" })
    }
  })
  .delete(async (req, res) => {
    const { productId } = req.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      const product = user.cart.find(item => item.productId == productId)
      if (product) {
        user.cart.pull({ _id: product._id });
        await user.save();
        return res.status(200).json({ cart: user.cart, success: true, message: "Successful" });
      } return res.status(404).json({ succes: false, errorMessage: "The product id you requested doesn't exists" });
    }
  })

router.delete("/wishlist/:productId", async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.user;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ success: false, errorMessage: "unable to find user" });
  } else {
    const product = user.wishList.find(item => item.productId == productId)
    if (product) {
      user.wishList.pull({ _id: product._id });
      await user.save();
      return res.status(200).json({ wishList: user.wishList, success: true, message: "Successful" });
    } return res.status(404).json({ succes: false, errorMessage: "The product id you requested doesn't exists" });
  }
})

router.route("/address")
  .get(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      return res.status(200).json({ addresses: user.addresses, success: true, message: "Success" })
    }
  })
  .post(async (req, res) => {
    const { newAddress } = req.body;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      user.addresses.push(newAddress);
      const updatedUser = await user.save();
      const newAddressFromDB = updatedUser.addresses.find((item) => item.phoneNumber == newAddress.phoneNumber);
      return res.status(201).json({ address: newAddressFromDB, success: true, message: "Successful" });
    }
  })

router.route("/address/:addressId")
  .post(async (req, res) => {
    const { addressId } = req.params;
    const updateAddress = req.body;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      const address = user.addresses.find(item => item._id == addressId)
      if (address) {
        let newAddress = extend(address, updateAddress.updateAddress);
        await user.save();
        return res.status(200).json({ address: newAddress, success: true, message: "Address Updated Successfully" })
      } return res.status(404).json({ success: false, errorMessage: "The address id you requested doesn't exists" });
    }
  })
  .delete(async (req, res) => {
    const { addressId } = req.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, errorMessage: "unable to find user" });
    } else {
      const address = user.addresses.find(item => item._id == addressId)
      if (address) {
        user.addresses.pull({ _id: address._id });
        await user.save();
        return res.status(200).json({ addresses: user.addresses, success: true, message: "Successful" });
      } return res.status(404).json({ succes: false, errorMessage: "The address id you requested doesn't exists" });
    }
  })

module.exports = router;