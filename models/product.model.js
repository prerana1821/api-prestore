const mongoose = require('mongoose');
const { products } = require("../data");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter Product Name'],
  },
  image: {
    type: String,
    required: [true, 'Please enter Product Image'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter Product Price'],
  },
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