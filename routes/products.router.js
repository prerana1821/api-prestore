const express = require('express');
const router = express.Router();
// const faker = require('faker');
// faker.seed(123);

// const categories = [
//   "Men's Swim Shorts",
//   "Floatation Devices",
//   "Training Kickboards",
//   "Kiddie Pools",
//   "Swimming Kits",
// ];

// const products = [...Array(10)].map((_) => (
//   {
//     id: faker.datatype.uuid(),
//     name: faker.commerce.productName(),
//     image: faker.random.image(),
//     price: faker.commerce.price(),
//     material: faker.commerce.productMaterial(),
//     brand: faker.lorem.word(),
//     inStock: faker.datatype.boolean(),
//     wishList: faker.datatype.boolean(),
//     fastDelivery: faker.datatype.boolean(),
//     ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
//     offer: faker.random.arrayElement([
//       "Save 50",
//       "70% bonanza",
//       "Republic Day Sale",
//     ]),
//     idealFor: faker.random.arrayElement([
//       "Men",
//       "Women",
//       "Girl",
//       "Boy",
//       "Senior",
//     ]),
//     category: faker.random.arrayElement(categories),
//     level: faker.random.arrayElement([
//       "Beginner",
//       "Amateur",
//       "Intermediate",
//       "Advanced",
//       "Professional",
//     ]),
//     color: faker.commerce.color(),
//   }
// ));

const { products } = require("../data");

router.get("/", (req, res) => {
  res.status(200).json({ products, success: true, message: "Successful" })
})

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((item) => item.id === id);
  if (product) {
    return res.status(200).json({ product, success: true, message: "Successful" })
  } res.status(404).json({ success: false, message: "The product ID sent has no product associated with it. Check and try again" })
})

module.exports = router;