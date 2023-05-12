const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  index: {type: String},
  imagePath: {type: String}
});

const eventSchema = new mongoose.Schema({
  title: {type: String},
  images: [imageSchema]
});

const EventModel = mongoose.model('Document', eventSchema);

module.exports = EventModel;
