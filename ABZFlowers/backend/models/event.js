const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
  name: { type: String },
  imagePath: { type: String }
});

module.exports = mongoose.model('Event', eventSchema);


