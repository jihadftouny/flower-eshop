const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const cartSchema = new mongoose.Schema({
  productName: { type: String },
  imagePath: { type: String },
});

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  phoneNumber:{ type: String },
  cart: [cartSchema],
  isAdmin: {type: Boolean}
});


userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
