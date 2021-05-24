const mongoose = require('mongoose');
const { categories } = require("../data");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: String
});

const Category = mongoose.model('Category', CategorySchema);

const addCategoriesToDB = () => {
  categories.forEach(async (category) => {
    const NewCategory = new Category(category);
    const savedCatgeory = await NewCategory.save();
  })
}

module.exports = { Category, addCategoriesToDB };