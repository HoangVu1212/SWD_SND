const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  parkingLot: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingLot" },
  startTime: Date,
  durationHours: Number,
  status: { type: String, enum: ["active", "completed"], default: "active" },
  totalFee: Number,
  bookedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
