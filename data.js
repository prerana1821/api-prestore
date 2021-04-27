const faker = require('faker');
faker.seed(123);

const categories = [
  "Men's Swim Shorts",
  "Floatation Devices",
  "Training Kickboards",
  "Kiddie Pools",
  "Swimming Kits",
];

const products = [...Array(10)].map((_) => (
  {
    name: faker.commerce.productName(),
    image: faker.random.image(),
    price: faker.commerce.price(),
    material: faker.commerce.productMaterial(),
    brand: faker.lorem.word(),
    inStock: faker.datatype.boolean(),
    wishList: faker.datatype.boolean(),
    fastDelivery: faker.datatype.boolean(),
    ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
    offer: faker.random.arrayElement([
      "Save 50",
      "70% bonanza",
      "Republic Day Sale",
    ]),
    idealFor: faker.random.arrayElement([
      "Men",
      "Women",
      "Girl",
      "Boy",
      "Senior",
    ]),
    category: faker.random.arrayElement(categories),
    level: faker.random.arrayElement([
      "Beginner",
      "Amateur",
      "Intermediate",
      "Advanced",
      "Professional",
    ]),
    color: faker.commerce.color(),
  }
));

const users = [
  {
    _id: "6087c9bc55425c068fef2e0a",
    wishList: [],
    cart: [],
    loading: "",
  },
]

const auth = [
  {
    username: "admin",
    email: "admin@gmail.com",
    password: "admin",
  },
];

module.exports = { users, auth, products }