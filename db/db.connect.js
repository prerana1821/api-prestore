const mongoose = require('mongoose');

const initializeDBConnection = async () => {
  try {
    const connection = await mongoose.connect('mongodb+srv://preStore:preStore@prestore-cluster.py3ia.mongodb.net/store?retryWrites=true&w=majority', {
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