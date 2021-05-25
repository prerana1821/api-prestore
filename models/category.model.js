const mongoose = require('mongoose');
const { categories } = require("../data");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  createdAt: Number,
  updatedAt: Number,
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: 'Category name should be unique'
  },
}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
  });

const Category = mongoose.model('Category', CategorySchema);

const addCategoriesToDB = () => {
  categories.forEach(async (category) => {
    const NewCategory = new Category(category);
    const savedCatgeory = await NewCategory.save();
  })
}

module.exports = { Category, addCategoriesToDB };