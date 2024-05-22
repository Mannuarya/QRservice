  const mongoose = require("mongoose");

  // Connect to the MongoDB database
  mongoose.connect(
    "mongodb+srv://mannuarya2002:manishmongo@cluster0.kquyzjn.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Database connected successfully");
  });

  // Define the schema for user login
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },
  });

  // Define the User model
  const User = mongoose.model("Users", userSchema); // Updated model name to match index.js

  module.exports = User;
