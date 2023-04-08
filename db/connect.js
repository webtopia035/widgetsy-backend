const mongoose = require("mongoose");

const connectDB = async (URL) => {
  return mongoose.connect(URL, console.log("Connected to MongoDB!"));
};

module.exports = connectDB;
