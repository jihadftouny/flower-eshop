const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  index: {type: String},
  imagePath: {type: String}
});

const eventSchema = new mongoose.Schema({
  name: {type: String},
  images: [imageSchema]
});
module.exports = mongoose.model('Event', eventSchema);

