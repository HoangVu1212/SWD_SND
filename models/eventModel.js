const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  location: String,
  ticketPrice: Number,
  totalSeats: Number,
  availableSeats: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
