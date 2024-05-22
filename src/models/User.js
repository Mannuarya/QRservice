const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  location: String,
  verificationToken: String,
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
