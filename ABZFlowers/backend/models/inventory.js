// product models
const mongoose = require('mongoose');

//creating a bluprint to how the data will look like
const inventorySchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  quantity: { type: String },
  currency: { type: String },
  price: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('Inventory', inventorySchema); //name and schema you will use, and export

