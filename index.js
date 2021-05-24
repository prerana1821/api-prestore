const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initializeDBConnection } = require("./db/db.connect");
const { addProductsToDB } = require("./models/product.model");
const { addAuthToDB } = require("./models/auth.model");
const { addUserToDB } = require("./models/user.model");
const {addCategoriesToDB} = require('./models/category.model');
const product = require("./routes/products.router");
const auth = require("./routes/auth.router");
const user = require("./routes/user.router");
const category = require('./routes/categories.router');
const { errorHandler } = require("./middlewares/error-handler.middleware");
const { routeNotFound } = require("./middlewares/route-not-found.middleware");

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

initializeDBConnection();

// will run only once
// addProductsToDB();
// addAuthToDB();
// addUserToDB();
// addCategoriesToDB();

app.use('/products', product);
app.use('/auth', auth);
app.use('/user-details', user);
app.use('/categories',category);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hello preStore!' })
});

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('server started at', PORT);
});