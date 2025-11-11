const mongoose = require("mongoose");

const parkingLotSchema = new mongoose.Schema({
  name: String,
  location: String,
  totalSlots: Number,
  availableSlots: Number,
  pricePerHour: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ParkingLot", parkingLotSchema);
