const mongoose = require('mongoose');

const uri = process.env['uri'];
const initializeDBConnection = async () => {
  try {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    if (connection) {
      console.log("Successfully Connected")
    }
  } catch (error) {
    console.error("mongoose connection failed", error)
  }
}

module.exports = { initializeDBConnection };