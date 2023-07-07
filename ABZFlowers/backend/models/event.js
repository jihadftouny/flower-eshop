const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
  name: { type: String },
  imagePath: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Event', eventSchema);


