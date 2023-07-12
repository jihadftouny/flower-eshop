// product models
const mongoose = require('mongoose');

//creating a bluprint to how the data will look like
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  quantity: { type: String},
  price: { type: String },
  currency: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Product', productSchema); //name and schema you will use, and export

