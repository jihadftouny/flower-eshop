// product models
const mongoose = require('mongoose');

//creating a bluprint to how the data will look like
const productSchema = new mongoose.Schema({
  carts: [products]

});

const products = new mongoose.Schema({
  title: { type: String, required: true },
  imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema); //name and schema you will use, and export

