// product models
const mongoose = require('mongoose');

//creating a bluprint to how the data will look like
const inventorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  image: { type: String },
  quantity: { type: Number },
  currency: { type: String },
  price: { type: Number },
  itemName: { type: String }
});

module.exports = mongoose.model('Inventory', inventorySchema); //name and schema you will use, and export

