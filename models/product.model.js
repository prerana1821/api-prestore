const mongoose = require('mongoose');
const { products } = require("../data");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  material: String,
  brand: String,
  inStock: Boolean,
  fastDelivery: Boolean,
  ratings: Number,
  offer: String,
  idealFor: String,
  category: String,
  level: String,
  color: String
});

const Product = mongoose.model('Product', ProductSchema);

const addProductsToDB = () => {
  products.forEach(async (product) => {
    const NewProduct = new Product(product);
    const savedProduct = await NewProduct.save();
  })
}

module.exports = { Product, addProductsToDB };