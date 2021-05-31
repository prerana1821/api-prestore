const express = require('express');
const router = express.Router();
const { Category } = require("../models/category.model");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories, success: true, message: "Successful" })
  } catch (error) {
    res.status(404).json({ success: false, errorMessage: "Error while retrieving categories", errorMessage: error.message })
  }
})

module.exports = router;