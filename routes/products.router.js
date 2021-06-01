const express = require('express');
const router = express.Router();
const { Product } = require("../models/product.model");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products, success: true, message: "Successful" })
  } catch (error) {
    res.status(404).json({ success: false, message: "Error while retrieving products", errorMessage: error.message })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let product = await Product.findById(id);
    product.__v = undefined;
    if (product) {
      return res.status(200).json({ product, success: true, message: "Successful" })
    } res.status(404).json({ success: false, errorMessage: "The product ID sent has no product associated with it. Check and try again" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message })
  }
});

module.exports = router;